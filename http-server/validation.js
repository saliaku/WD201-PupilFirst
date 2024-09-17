const email = document.getElementById('email');

email.addEventListener('input', () => validate(email) );
    
    
    function validate(element) {
        if (element.validity.typeMismatch) {
            element.setCustomValidity('Please enter a valid email address');
        } else {
            element.setCustomValidity('');
        }
    }

const dob = document.getElementById('dob');

dob.addEventListener('input', () => validate(dob) );

function validate(element) {
    // Age should be between 18 and 55
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate());

    const dob = new Date(element.value);

    // Year-based validation
    if (dob.getFullYear() < minDate.getFullYear() || dob.getFullYear() > maxDate.getFullYear()) {
        element.setCustomValidity('Age should be between 18 and 55');
    }
    // Exact year checks for max and min age
    else if (dob.getFullYear() === maxDate.getFullYear() && dob.getMonth() > maxDate.getMonth()) {
        element.setCustomValidity('Age should be between 18 and 55');
    }
    else if (dob.getFullYear() === maxDate.getFullYear() && dob.getMonth() === maxDate.getMonth() && dob.getDate() > maxDate.getDate()) {
        element.setCustomValidity('Age should be between 18 and 55');
    }
    else if (dob.getFullYear() === minDate.getFullYear() && dob.getMonth() < minDate.getMonth()) {
        element.setCustomValidity('Age should be between 18 and 55');
    }
    else if (dob.getFullYear() === minDate.getFullYear() && dob.getMonth() === minDate.getMonth() && dob.getDate() < minDate.getDate()) {
        element.setCustomValidity('Age should be between 18 and 55');
    }
    else {
        element.setCustomValidity('');
    }

    // console.log(dob);
    // console.log(maxDate);
    // console.log(minDate);
    // console.log(today);
}
