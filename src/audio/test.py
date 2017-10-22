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

from scipy.io.wavfile import read

def get_rate():
    sample_rate, wavdata = read('C4.wav') # input wav file from Echo here
    return sample_rate
