#!/usr/bin/python
import sys

arg1 = sys.argv[1]
f = open('process.txt', 'w')
f.write(arg1)
f.close()