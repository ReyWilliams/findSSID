import os
import dropbox


dbx = dropbox.Dropbox('4IUmso5iMZUAAAAAAAAAAd27subITDNN3wb5uEjjjQ1z4GJlP7ni0Sdm3FkU-Tzd') 
dbx.users_get_current_account()

for root, dirs, files in os.walk("/home/pi/Desktop/SSIDOutputFiles"):
    for file in files:
        if file.endswith(".txt"):
            f = open(os.path.join(root,file),'rb')
            dbx.files_upload(bytes(f.read()),'/Readings/output.txt',autorename=True) 