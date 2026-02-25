import os

folder_path = "D:/Proiecte/biology lab v3/biology-lab/public/gallery/acvariu-colegiul-national"

for file in os.listdir(folder_path):
    print("![](/gallery/acvariu-colegiul-national/"+file+")")
