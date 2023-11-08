window.onload = function() {
    // Pobieramy wszystkie pola tekstowe, checkboxy i numeryczne na stronie
    let inputs = document.querySelectorAll('input[type=text], input[type=checkbox], input[type=number], input[type=range]');
    for(let i = 0; i < inputs.length; i++) {
        // Jeśli to nie jest checkbox z trybem ciemnym
        if(inputs[i].id !== 'darkMode') {
            if(inputs[i].type === 'checkbox') {
                inputs[i].checked = false;
            } else {
                inputs[i].value = '';
            }
        }
    }
};

const leetMap = {
    'a': '4',
    'e': '3',
    'g': '6',
    'i': '1',
    'o': '0',
    's': '5',
    't': '7'
};

function convertToLeetSpeak(password) {
    let leetPassword = '';
    for (let char of password) {
        leetPassword += leetMap[char.toLowerCase()] || char;
    }
    return leetPassword;
}

document.addEventListener('DOMContentLoaded', (event) => {
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.getElementById('darkMode').checked = isDarkMode;
});

document.getElementById('leetSpeakForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let word = document.getElementById('word').value;
    
    // Sprawdzamy, czy pole wprowadzania jest puste
    if (word.trim() === '') {
        alert('Proszę wprowadzić słowo.');
        return;
    }

    let leetWord = convertToLeetSpeak(word);
    document.getElementById('leetWord').innerText = leetWord;
    document.getElementById('passwordStrengthLeet').innerText = "Siła hasła: " + checkPasswordStrength(leetWord);

    // Dodajemy hasło do historii
    let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    passwordHistory.push(leetWord);
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));

    // Aktualizujemy wyświetlanie historii haseł
    displayPasswordHistory();

    // Czyścimy pole wprowadzania
    document.getElementById('word').value = '';
});

// Dodajemy obsługę historii haseł do funkcji generującej hasło
document.getElementById('passwordGeneratorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let length = document.getElementById('length').value;
    let lowercase = document.getElementById('lowercase').checked;
    let uppercase = document.getElementById('uppercase').checked;
    let numbers = document.getElementById('numbers').checked;
    
    let password = generatePassword(length, lowercase, uppercase, numbers);
    
    // Jeśli hasło jest komunikatem o błędzie, nie przetwarzamy go dalej
    if (password.startsWith('Błąd:')) {
        alert(password);
        return;
    }
    
    password = convertToLeetSpeak(password);
    document.getElementById('password').innerText = password;
    document.getElementById('passwordStrength').innerText = "Siła hasła: " + checkPasswordStrength(password);

    let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    passwordHistory.push(password);
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));

    displayPasswordHistory();
});

// Dodajemy przycisk do usuwania historii haseł
document.getElementById('deleteHistoryButton').addEventListener('click', function() {
    console.log('Button clicked!')
    // event.preventDefault();

    localStorage.removeItem('passwordHistory');
});

document.getElementById('copyButton').addEventListener('click', function() {
    console.log('Button clicked!')
    // event.preventDefault();

    let password = document.getElementById('password').innerText;
    navigator.clipboard.writeText(password);
});

document.getElementById('copyButtonLeet').addEventListener('click', function() {
    console.log('Button clicked!')
    // event.preventDefault();

    let leetWord = document.getElementById('leetWord').innerText;
    navigator.clipboard.writeText(leetWord);
});

document.getElementById('darkMode').addEventListener('change', function(event) {
    document.body.classList.toggle('dark-mode', event.target.checked);
    localStorage.setItem('darkMode', event.target.checked);
});

function displayPasswordHistory() {
    let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    document.getElementById('passwordHistory').innerText = passwordHistory.join('\n');
}


function generatePassword(length, lowercase, uppercase, numbers) {
    let characters = '';
    if (!length || length <= 0) {
        return 'Błąd: Musisz wybrać długość hasła!';
    }
    if (lowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) characters += '0123456789';
    let special = document.getElementById('special').checked;
    if (special) characters += '!@#$%^&*(){}[]=<>/,.';
    
    // Jeśli żaden z checkboxów nie jest zaznaczony, zwracamy komunikat o błędzie
    if (characters === '') {
        return 'Błąd: Musisz zaznaczyć przynajmniej jeden checkbox!';
    }
    
    let password = "";
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) {
        strength++;
    }
    if (/[A-Z]/.test(password)) {
        strength++;
    }
    if (/[a-z]/.test(password)) {
        strength++;
    }
    if (/[0-9]/.test(password)) {
        strength++;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
        strength++;
    }

    let description = "";
    switch(strength) {
        case 1: description = "Bardzo słabe"; break;
        case 2: description = "Słabe"; break;
        case 3: description = "Dobre"; break;
        case 4: description = "Silne"; break;
        case 5: description = "Bardzo silne"; break;
    }
    return description;
}
displayPasswordHistory();

