"""
Forte web app - volume portion

Objective: 
    - Get background noise, Amazon echo

"""

# Importing libraries
import numpy as np
import pandas as pd
import math
import wave
    
class Volume():
    
    def __init__(self):
        
        # Importing the self.dataset
        self.dataset = pd.read_csv('SoundLevels.csv')
        
        # Replace - with avg. of the two extrema
        for i in range(len(self.dataset.DBA.tolist())):
            if (self.dataset['DBA'][i].find('-') != -1):
                subset = self.dataset['DBA'][i].split('-')
                self.dataset['DBA'][i] = (int(subset[0]) + int(subset[1])) // 2
            else:
                self.dataset['DBA'][i] = math.floor(int(
                        self.dataset['DBA'][i]))
        
        
        cats = []
        for i in range(len(self.dataset.SoundCategory.tolist())):
            if (self.dataset['SoundCategory'][i] not in cats):
                cats.append(self.dataset['SoundCategory'][i])
    
    
    def largest(self, file_name):
        
        sound = wave.open(file_name,'rb')
        
        nframes = sound.getnframes()
        if sound.getsampwidth() != 2:
            raise ValueError("Only supports 16 bit audio formats")

        if sound.getnchannels() == 2:
            nframes*=2 
            
        byteList = np.fromstring(sound.readframes(nframes), dtype = np.int16)
        sound.close()
        byteList = byteList.astype(np.float) 

        maximum = max(byteList)
        minimum = min(byteList)
        peak = (math.fabs(maximum)+math.fabs(minimum))/2
        return peak 
    
    
    def db_increase(self):
        """
        ASHA noise scale: https://www.asha.org/public/hearing/Noise/
        """
        dbs = []
        for i in range(len(self.dataset.DBA.tolist())):
            num = math.floor(int(self.dataset['DBA'][i]))
            
            if (num >= 120): #120+ DBA sounds are very painful, according to ASHA.
                dbs.append(math.floor(int(num*0.50))) #keeping the sound to a safe range
            
            elif (80 <= num < 120):
                dbs.append(math.floor(int(num*0.70)))
                
            elif (60 <= num < 70):
                dbs.append(math.floor(int(num + 10)))
                
            elif (40 <= num < 60):
                dbs.append(math.floor(int(num + 20)))
            
            elif (num < 40):
                dbs.append(math.floor(int(num*2)))
                
            else:
                dbs.append(math.floor(int(num)))
                
        return dbs
    
    def calculate_dba(self, db):
        """
        Convert db to sones, then to DBA. 
        Formula: http://www.sengpielaudio.com/calculatorSonephon.htm
                 https://www.ventilationdirect.com/CATALOGCONTENT/DOCUMENTS/SOUND%20CONVERSION%20CHART.pdf
        """
        return math.floor(int(33.2 * (math.log10(db / 40))) + 28)
    
    def dba_to_db(self, dba):
        """
        Reverting dba to db. 
        """
        return math.pow(10, ((dba - 28)/(33.22))) 
    
    def decibel(self, file_name):
        
        db = 20 * math.log10(self.largest(file_name))
        dba = self.calculate_dba(db)
        
        new_column = self.db_increase()
        self.dataset['DBIncrease'] = new_column
        X = self.dataset.iloc[:, 1:2].values
        y = self.dataset.iloc[:, 3].values
        
        # Splitting the self.dataset into the Training set and Test set
        from sklearn.cross_validation import train_test_split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)
        
        # Using random forest regression model to predict new decibel
        from sklearn.ensemble import RandomForestRegressor
        regressor = RandomForestRegressor(n_estimators = 10, random_state = 0)
        regressor.fit(X, y)
        
        # Predicting a new result
        y_pred = regressor.predict(dba)[0]
        return self.dba_to_db(y_pred)
    
    
    
    