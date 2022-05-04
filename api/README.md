# API
![Express](https://img.shields.io/badge/express-v4.17.2+-green.svg)

Περιεχόμενα:

- RESTful API

# Packages

- Για το Routing: Express.js (Μέθοδοι POST και GET )

  Installation: `npm install express --save`

  Installation for POST requests: `sudo npm install --save body-parser`

# Documentation

- Base URL : https://localhost:9103/interoperability/api

- Διαχειριστικά Endpoints


  1. healthcheck: 

     Μέθοδος: GET

     URL: https://localhost:9103/interoperability/api/admin/healthcheck

     Λειτουτργία: Eπιβεβαιώνει τη συνδεσιμότητα (end-to-end connectivity) μεταξύ του χρήστη και της βάσης δεδομένων

     Σε περίπτωση επιτυχούς σύνδεσης επιστρέφεi : {"status":"OK", "dbconnection":"mongodb://localhost:27017/InterTollsDB"}

     Σε περίπτωση αποτυχίας επιστρέφει :  {"status":"failed", "dbconnection":"mongodb://localhost:27017/InterTollsDB"}


  2. resetpasses:

     Μέθοδος: POST

     URL: https://localhost:9103/interoperability/api/admin/resetpasses

     Λειτουργία: Aρχικοποίηση του πίνακα γεγονότων διέλευσης (διαγραφή όλων των γεγονότων)

     Σε περίπτωση επιτυχίας επιστρέφεται το json object: {"status":"OK"}

     Σε περίπτωση αποτυχίας επιστρέφει: {"status":"failed"}


  3. resetstations:

     Μέθοδος: POST

     URL: https://localhost:9103/interoperability/api/admin/resetstations

     Λειτουργία: Aρχικοποίηση του πίνακα σταθμών διοδίων με τις τιμές που μας δόθηκαν ως ενδεικτικά δεδομένα

     Σε περίπτωση επιτυχίας επιστρέφεται το json object: {"status":"OK"}

     Σε περίπτωση αποτυχίας επιστρέφει: {"status":"failed"}


  4. resetvehicles :

     Μέθοδος: POST

     URL: https://localhost:9103/interoperability/api/admin/resetvehicles

     Λειτουργία: Aρχικοποίηση του πίνακα οχημάτων με τις τιμές που μας δόθηκαν ως ενδεικτικά δεδομένα

     Σε περίπτωση επιτυχίας επιστρέφεται το json object: {"status":"OK"}

     Σε περίπτωση αποτυχίας επιστρέφει: {"status":"failed"}


