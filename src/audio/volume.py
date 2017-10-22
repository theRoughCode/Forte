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
import decimal 

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
    
    
    def volume_pred(self):
        """
        ASHA noise scale: https://www.asha.org/public/hearing/Noise/
        The noise's new level
                
        """
        
        dbs = []
        data = self.dataset.DBA.tolist()
        syndata = data[:]
        for i in range(len(syndata)):
           
            x = self.dba_to_db(syndata[i])
            
            if (x/10 - 12 < 3):
                num1 = decimal.Decimal(math.pow(10, x/10 - 12))
            else:
                num1 = decimal.Decimal(1)
            
            num2 = decimal.Decimal(math.pow(10, -9))
            
            den = decimal.Decimal(math.pow(10, -3))
            
            volume = decimal.Decimal((num1 - num2) / den)
            
            dbs.append(volume)
            
        return dbs
    
    
    def calculate_dba(self, db):
        """
        Convert db to sones, then to DBA. 
        Formula: http://www.sengpielaudio.com/calculatorSonephon.htm
                 https://www.ventilationdirect.com/CATALOGCONTENT/DOCUMENTS/SOUND%20CONVERSION%20CHART.pdf
        """
        return 33.2 * (math.log10(db / 40)) + 28
    
    def dba_to_db(self, dba):
        """
        Reverting dba to db. 
        """
        
        return math.pow(10, (dba - 28)/33.22) 
    
    def decibel(self, file_name):
        db = 20 * math.log10(self.largest(file_name))
        dba = self.calculate_dba(db)
        new_column = self.volume_pred()
        self.dataset['DBChange'] = new_column
        X = self.dataset.iloc[:, 1:2].values
        y = self.dataset.iloc[:, 3].values
        
        # Fitting SVR to the dataset
        from sklearn.svm import SVR
        regressor = SVR(kernel = 'rbf')
        regressor.fit(X, y)
        
        """
        KERNELING
        mapping of data into a higher dimension
        
        """
        # Predicting a new result
        y_pred = regressor.predict(dba)
        
        if (y_pred <= 0):
            return 0
        elif (y_pred >= 100):
            return 100
        else:
            return self.dba_to_db(y_pred)*100

