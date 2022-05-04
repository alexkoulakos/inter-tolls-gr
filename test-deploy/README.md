Για το στήσιμο του περιβάλλοντος στο οποίο λειτουργεί η εφαρμογή μας, απαιτούνται σειριακά τα παρακάτω βήματα (configurations):

1. Μέσα στο φάκελο backend δίνουμε την εντολή ```npm install nodemon```. Το module ```nodemon``` είναι υπεύθυνο για την αυτόματη επανεκκίνηση του server κάθε φορά που σημειώνεται αλλαγή σε αρχείο του directory TL21-05.

2. Δημιουργία ασφαλούς σύνδεσης https.

   1. Δημιουργία αρχείων cert.key και cert.pem. 

        **Ανοίγουμε συγκεκριμένα το GitBash**, περιηγούμαστε στο directory **~/OneDrive/Υπολογιστής/softeng/TL21-05/security** και δίνουμε την εντολή ```openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256```. 
      
   2. Άνοιγμα Google Chrome. 
   
        Στη συνέχεια, μεταβαίνουμε π.χ.στο [healthcheck endpoint](https://localhost:9103/interoperability/api/admin/healthcheck) και λαμβάνουμε το ακόλουθο μήνυμα. 
        ![image](https://user-images.githubusercontent.com/94241779/146957067-94a1760c-dd8e-4c14-8572-3c87d77107c7.png)

   3. Ρυθμίσεις Google Chrome. 
      - Ανοίγουμε τα Developer Tools, πηγαίνουμε στο Security Panel και κάνουμε κλικ στο View Certificate. ![image](https://user-images.githubusercontent.com/94241779/146960536-c7980dfa-c8f7-4697-a614-2b78b36a5dd9.png)
    
      - Πηγαίνουμε στο Details Panel, κάνουμε κλικ στο "Copy to File" και τότε εκκινεί ο Certificate Export Wizard. Επιλέγουμε "Next" στο πρώτο παράθυρο που εμφανίζεται. ![image](https://user-images.githubusercontent.com/94241779/146961347-5bb7945f-e2b1-4606-820b-22e04d410659.png)

      - Στο επόμενο παράθυρο, αφήνουμε την κωδικοποίηση DER binary ως έχει και επιλέγουμε "Next". Κάνουμε Browse σε ένα εύκολα προσβάσιμο directory (π.χ. Desktop) και ονομάζουμε το certificate που θα κάνουμε export localhost.cer. Στη συνέχεια, κάνουμε κλικ στο "Save" και "Finish". Αν όλα έχουν πάει καλά με το Export, πρέπει να εμφανίζεται το μήνυμα ***The export was successful***. 

      - Κάνουμε κλικ [εδώ](chrome://settings). Κάνουμε κλικ στο Security and Privacy -> Security. Κάνουμε scroll down και επιλέγουμε Manage Certificates. ![image](https://user-images.githubusercontent.com/94241779/146962967-48bb8318-c44f-444d-b4fb-458d9129e80d.png)

      - Επιλέγουμε το Trusted Root Certification Authorities Panel και κάνουμε import το αρχείο localhost.cer που κάναμε export στο βήμα 3, αφήνοντας τις default τιμές τσεκαρισμένες. 
      ![image](https://user-images.githubusercontent.com/94241779/146963742-bb76ff76-b27a-49c5-af24-a6239457fb8f.png)

      - Τέλος, κάνουμε κλικ στο "Yes" στο μήνυμα ***Do you want to install this certficate?***

      - Μετά από όλη αυτή τη διαδικασία, **επανεκκινούμε το Google Chrome** και αν ξανατρέξουμε το server π.χ. για το [healthcheck endpoint](https://localhost:9103/interoperability/api/admin/healthcheck) βλέπουμε στον browser το μήνυμα
      ![image](https://user-images.githubusercontent.com/94241779/146964719-e9e10f6f-fbd5-4ce5-959f-8a95e18c35d3.png)
    
    Σημείωση: Για περισσότερες πληροφορίες, ανατρέξτε στο αρχείο README του φακέλου backend.

3. Για την εγκατάσταση των απαραίτητων modules που χρησιμοποιεί το backend, δίνουμε την εντολή ```npm link``` (η εντολή αυτή αντικαθιστά την εντολή ```node commands.js``` με ```se2105``` που είναι και το όνομα του CLI μας). Στη συνέχεια εκτελούε ```npm install commander```. 
