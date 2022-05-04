# Back-end
![NodeJS](https://img.shields.io/badge/nodeJS-v7.3+-blue.svg)
![Express](https://img.shields.io/badge/express-v4.17.2+-green.svg)
![Mongodb](https://img.shields.io/badge/mongodb-v4.3.0+-red.svg)
![Mongoose](https://img.shields.io/badge/mongoose-v6.1.6+-yellow.svg)
![Nodemon](https://img.shields.io/badge/nodemon-v2.0.15+-blue.svg)

- Δημιουργία ασφαλούς σύνδεσης HTTPS

    Για να δημιουργήσουμε έναν _https server_ στον οποίο μπορούμε να συνδεθούμε ασφαλώς, πρέπει σε πρώτο στάδιο να παράξουμε ένα _self-signed certificate_ το οποίο αποτελεί μια ειδική κατηγορία του _SSL Certificate_. Ένα τέτοιο certificate προσδιορίζεται από δύο αρχεία, το _cert.key_ (το ίδιο το certificate) και το _cert.pem_ (το private key του certificate). 

    Tα δύο αρχεία cert.key και cert.pen παράγονται από την εντολή

    ```bash
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
    ```

    στο _GitBash_ και αποθηκεύονται στο directory _security_ που με τη σειρά του ανήκει στο ίδιο directory που βρίσκεται και το _api_. Για τη δημιουργία του server χρησιμοποιούμε τη μέθοδο ```https.CreateServer()```  στο αρχείο ```app.js```
    της _express_ και π.χ. για το endpoint _healthcheck_ στον browser λαμβάνουμε το εξής μήνυμα

    ![image](https://user-images.githubusercontent.com/94241779/146957067-94a1760c-dd8e-4c14-8572-3c87d77107c7.png)

    Το output στην οθόνη είναι σωστό, σύμφωνα με τις προδιαγραφές της εκφώνησης, αλλά το Google Chrome εμφανίζει προειδοποίηση ότι η σύνδεση δεν είναι ασφαλής. Έτσι, αφού έχουμε δημιουργήσει το certificate που εξασφαλίζει πρόσβαση στον https server, πρέπει να εξασφαλίσουμε την εγκυρότητα του, ώστε η σύνδεση να είναι πλέον ασφαλής. Προς το σκοπό αυτό, ακολουθούμε τα εξής βήματα (τα οποία ισχύουν αυστηρά για το Google Chrome ως προεπιλεγμένο web browser):

    1. Ανοίγουμε τα Developer Tools, πηγαίνουμε στο Security Panel και κάνουμε κλικ στο View Certificate. ![image](https://user-images.githubusercontent.com/94241779/146960536-c7980dfa-c8f7-4697-a614-2b78b36a5dd9.png)
    
    2. Πηγαίνουμε στο Details Panel, κάνουμε κλικ στο "Copy to File" και τότε εκκινεί ο Certificate Export Wizard. Επιλέγουμε "Next" στο πρώτο παράθυρο που εμφανίζεται. ![image](https://user-images.githubusercontent.com/94241779/146961347-5bb7945f-e2b1-4606-820b-22e04d410659.png)

    3. Στο επόμενο παράθυρο, αφήνουμε την κωδικοποίηση DER binary ως έχει και επιλέγουμε "Next". Κάνουμε Browse σε ένα εύκολα προσβάσιμο directory (π.χ. Desktop) και ονομάζουμε το certificate που θα κάνουμε export localhost.cer. Στη συνέχεια, κάνουμε κλικ στο "Save" και "Finish". Αν όλα έχουν πάει καλά με το Export, πρέπει να εμφανίζεται το μήνυμα ***The export was successful***. 

    4. Κάνουμε κλικ [εδώ](chrome://settings/). Κάνουμε κλικ στο Privacy and Security -> Security. Κάνουμε scroll down και επιλέγουμε Manage Certificates. ![image](https://user-images.githubusercontent.com/94241779/146962967-48bb8318-c44f-444d-b4fb-458d9129e80d.png)

    5. Επιλέγουμε το Trusted Root Certification Authorities Panel και κάνουμε import το αρχείο localhost.cer που κάναμε export στο βήμα 3, αφήνοντας τις default τιμές τσεκαρισμένες. 

    ![image](https://user-images.githubusercontent.com/94241779/146963742-bb76ff76-b27a-49c5-af24-a6239457fb8f.png)

    6. Τέλος, κάνουμε κλικ στο "Yes" στο μήνυμα ***Do you want to install this certficate?***

    Μετά από όλη αυτή τη διαδικασία, επανεκκινούμε τον Google Chrome και αν ξανατρέξουμε τον https server βλέπουμε στον browser το μήνυμα
    
    ![image](https://user-images.githubusercontent.com/94241779/146964719-e9e10f6f-fbd5-4ce5-959f-8a95e18c35d3.png)

    Η σύνδεση, λοιπόν, είναι πλέον ασφαλής και έτσι μπορούμε να τρέξουμε κανονικά όλα τα requests σε Postman, όπως φαίνεται αναλυτικά και στο Postman Documentation.

# NodeJS Packages

```bash
"dependencies": {
    "body-parser": "^1.19.1",
    "connect": "^3.7.0",
    "convert-array-to-csv": "^2.0.0",
    "convert-csv-to-array": "^1.0.3",
    "csvtojson": "^2.0.10",
    "express": "^4.17.2",
    "json2csv": "^5.0.6",
    "mongodb": "^4.3.0",
    "mongoose": "^6.1.6",
    "nodemon": "^2.0.15",
    "path": "^0.12.7"
  }
```

