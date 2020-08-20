// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*admin.initializeApp(functions.config().firebase);
const uniqueNumbersRef = admin.firestore().collection('uniqueNumbers');


export const onRoomDeleted = functions.firestore.document('rooms/{roomID}').onDelete((snapshot, context) => {
    const roomNumber = snapshot.data().roomNumber;
    uniqueNumbersRef.doc('75i58A757ArLN1fJJ33G').get().then((doc) => {
        // @ts-ignore
        const numbers: string[] = doc.data().uniqueNumbers;
        numbers.splice(numbers.indexOf(roomNumber), 1);
        return uniqueNumbersRef.doc('75i58A757ArLN1fJJ33G').update({
            uniqueNumbers: numbers
        })
    }).catch(() => {
        return null;
    })
})

export const onRoomCreated = functions.firestore.document('rooms/{roomID}').onCreate((snapshot, context) => {
    function checkUniqueNumber(numberArray: string[], numberString: string): boolean {
        for (const assignedNumber of numberArray) {
            if (assignedNumber === numberString) {
                return false;
            }
        }
        return true;
    }
    uniqueNumbersRef.doc('75i58A757ArLN1fJJ33G').get().then((doc) => {
        // @ts-ignore
        const numbers: string[] = doc.data().uniqueNumbers;
        let newNumber: string = '';
        let haventFoundNewNumber = true;
        while (haventFoundNewNumber) {
            newNumber = Math.floor(Math.random() * 1000 + 9999).toString();
            if (checkUniqueNumber(numbers, newNumber)) {
                haventFoundNewNumber = false;
            }
        }
        numbers.push(newNumber);
        uniqueNumbersRef.doc('75i58A757ArLN1fJJ33G').update({
            uniqueNumbers: numbers
        }).then(() => {
            return snapshot.ref.update({
                roomNumber: newNumber
            });
        }).catch(() => {
            return null;
        })
    }).catch(() => {
        return null;
    })
})*/
