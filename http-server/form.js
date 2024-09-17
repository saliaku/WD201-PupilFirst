//for registration 
let userform = document.getElementById('user-form');

const retriveEntries = () => {
    let entries = localStorage.getItem("userEntries");
    if(entries){
        entries = JSON.parse(entries);
    }else{
        entries = [];
    }

    return entries;
}

let userEntries = retriveEntries();

const displayEntries = () => {
    const entries = retriveEntries();
    const tableEntries = entries.map((entry) => {
        const nameCell = '<td>' + entry.name + '</td>';
        const emailCell = '<td>' + entry.email + '</td>';
        const passwordCell = '<td>' + entry.password + '</td>';
        const dobCell = '<td>' + entry.dob + '</td>';
        const acceptedTermsandConditionsCell = '<td>' + entry.acceptedTermsandConditions + '</td>';

        // Return the complete table row
        return '<tr>' + nameCell + emailCell + passwordCell + dobCell + acceptedTermsandConditionsCell + '</tr>';
    }).join('\n'); // Join rows with a new line for better readability

    const table = `
        <table border="1" cellpadding="10" cellspacing="0">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Dob</th>
                <th>Accepted terms?</th>
            </tr>
            ${tableEntries}
        </table>
    `;

    let details = document.getElementById("user-entries");
    details.innerHTML = table;
}

const saveUserForm = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptedTermsandConditions = document.getElementById("acceptTerms").checked;

    const entry = {
        name,
        email,
        password,
        dob,
        acceptedTermsandConditions
    };

    userEntries.push(entry);

    localStorage.setItem("userEntries", JSON.stringify(userEntries));
    displayEntries();
}

userform.addEventListener("submit",saveUserForm);
displayEntries();