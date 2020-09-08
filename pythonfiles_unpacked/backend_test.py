import sys
import json
import virtual_ensemble as vmet
from datetime import date

data = sys.argv[1]

# to package:
# run pyinstaller -F --add-data "./ffmpeg/*;./ffmpeg/" backend_test.py 
# to handle ffmpeg executable
def main(files):
    print(sys.argv)
    print("files: ", sys.argv[1])
    print("files1: ", sys.argv[1][0])
    today = date.today()
    month = int(today.strftime("%m"))
    year = int(today.strftime("%Y"))
    if (year <= 2020) and (month <= 9):
        print('RUN')
        result = json.loads(files)
        print(result)
        pr = vmet.Processor(result)
        filename = 'final_ensemble'
        pr.run_app(filename)
    else:
        print('EXPI')
    return 1

print(main(data))
