"""
Forte web app - volume portion

Objective: 
    - Get background noise, Amazon echo

"""

# Importing libraries
import matplotlib as mpl
import numpy as np
import pandas as pd
import math

# Importing the dataset
dataset = pd.read_csv('SoundLevels.csv')
dataset.round()
    
X = dataset.iloc[:, 1].values
y = dataset.iloc[:, 2].values

# Replace - with avg. of the two extrema
for i in range(len(dataset.DBA.tolist())):
    if (dataset['DBA'][i].find('-') != -1):
        subset = dataset['DBA'][i].split('-')
        dataset['DBA'][i] = (int(subset[0]) + int(subset[1])) // 2
    else:
        dataset['DBA'][i] = math.floor(int(dataset['DBA'][i]))

def get_categories(dataset):
    cats = []
    for i in range(len(dataset.SoundCategory.tolist())):
        if (dataset['SoundCategory'][i] not in cats):
            cats.append(dataset['SoundCategory'][i])
    return cats

category_list = get_categories(dataset)


def calculate_dba(db):
    """
    Convert db to sones, then to DBA. 
    Formula: http://www.sengpielaudio.com/calculatorSonephon.htm
             https://www.ventilationdirect.com/CATALOGCONTENT/DOCUMENTS/SOUND%20CONVERSION%20CHART.pdf
    """
    return 33.2 * (math.log10((20*math.log10(db) / 40))) + 28


from scipy.io.wavfile import read

#TODO: Convert Echo to wav file
 
sample_rate, wavdata = read('car_screech.wav') # input wav file from Echo here
chunks = np.array_split(wavdata, 1)
dba = ([calculate_dba(math.sqrt(np.mean(chunk**2))) for chunk in chunks])[0]

def db_increase():
    """
    ASHA noise scale: https://www.asha.org/public/hearing/Noise/
    """
    dbs = []
    for i in range(len(dataset.DBA.tolist())):
        num = math.floor(int(dataset['DBA'][i]))
        
        if (num >= 120): #120+ DBA sounds are very painful, according to ASHA.
            dbs.append(num*0.50) #keeping the sound to a safe range
        
        elif (80 <= num < 120):
            dbs.append(num*0.70)
            
        elif (60 <= num < 70):
            dbs.append(num + 10)
            
        elif (40 <= num < 60):
            dbs.append(num + 20)
        
        elif (num < 40):
            dbs.append(num*2)
            
        else:
            dbs.append(num)
            
    return dbs

new_column = db_increase()
#dataset['DBIncrease'] = new_column
dataset.insert(2,'DBIncrease', new_column)
X = dataset.iloc[:, [1, 2]].values
y = dataset.iloc[:, 3].values


# Splitting the dataset into the Training set and Test set
from sklearn.cross_validation import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)


# PART 2: CLASSIFY MODEL  

# Fitting SVM to the Training set
from sklearn.naive_bayes import GaussianNB
classifier = GaussianNB()
classifier.fit(X_train, y_train)

# Predicting the Test set results
y_pred = classifier.predict(X_test)

# Set the background sound as a .wav file


# Match intensity to certain categories


# Change volume of Amazon Echo speaker...
# e.g. 440_sine.wav




