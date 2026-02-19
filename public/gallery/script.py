import os

folder_path = "D:/Proiecte/biology lab v3/biology-lab/public/gallery/ochiul-prin-ochii-nostri"

for file in os.listdir(folder_path):
    print("![](/gallery/ochiul-prin-ochii-nostri/"+file+")")
