document.addEventListener('DOMContentLoaded', () => {
    const reloadLink = document.querySelector('#reloadLink');

    if (reloadLink) {
        reloadLink.addEventListener('click', (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            location.reload(); // Recarga la página
        });
    }
});

const OPTIONS = {
    method: 'GET'
}

const $ = selector => document.querySelector(selector)
const $form = $('#form')
const $publicIpForm = $('#publicIpForm')
const $input = $('#inputIp')
const $ipLabel = $('#ipLabel')
const $example = $('#example')
const $submit = $('#submit')
const $submitPublicIp = $('#submitPublicIp')
const $results = $('#results')
const $select = $('#language-select')
const $langLabel = $('#langLabel')

let selectedLanguage = $select.value // Inicializa con el valor actual del <select>


const loadPublicIp = async () => {
    try {
        const response = await fetch(`https://ip-api.com/json/?lang=${selectedLanguage}`);
        const data = await response.json(); 
        const publicIP = data.query; 
        console.log('Public IP:', publicIP);
        console.log('IP Information:', data); 
        return data;
      } catch (error) {
        console.error('Error fetching public IP info:', error);
        return null;
      }
}
loadPublicIp()








// Función para cargar traducciones desde el archivo JSON

const loadTranslations = async () => {
    try {
        const response = await fetch('https://run.mocky.io/v3/f8ebf5ae-6de5-4982-b941-51f73f9b72c8')
        const translations = await response.json()
        return translations
    } catch (error) {
        console.error('Error loading translations:', error)
    }
}

// Función para aplicar traducciones a la página
const applyTranslations = (translations, language) => {
    $langLabel.textContent = translations[language].lang
    $ipLabel.firstChild.textContent = translations[language].ipLabel
    $input.placeholder = translations[language].ipPlaceholder
    $example.textContent = translations[language].ipExample  
    $submit.textContent = translations[language].submitButton
    $submitPublicIp.textContent = translations[language].submitPublic
}

// Manejador de eventos para el cambio de selección
const handleLanguageChange = async () => {
    const translations = await loadTranslations()
    selectedLanguage = $select.value
    applyTranslations(translations, selectedLanguage)
}

// Función para obtener información de IP
const fetchIpInfo = async (ip) => {
    try {
        const response = await fetch(`https://ip-api.com/json/${ip}?lang=${selectedLanguage}`, OPTIONS)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching IP info:', error)
    }
}

// Manejo del envío de los formularios
$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const { value: ipValue } = $input
    if (!ipValue) return

    $submit.setAttribute('disabled', '')
    $submit.setAttribute('aria-busy', 'true')

    const ipInfo = await fetchIpInfo(ipValue)

    if (ipInfo) {
        $results.innerHTML = JSON.stringify(ipInfo, null, 2)
    }

    $submit.removeAttribute('disabled')
    $submit.removeAttribute('aria-busy')
})

$publicIpForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    $submitPublicIp.setAttribute('disabled', '')
    $submitPublicIp.setAttribute('aria-busy', 'true')

    const ipInfoPublic = await loadPublicIp()

        $results.innerHTML = JSON.stringify(ipInfoPublic, null, 2)

    $submitPublicIp.removeAttribute('disabled')
    $submitPublicIp.removeAttribute('aria-busy')
})



// Inicializa la página con el idioma predeterminado
document.addEventListener('DOMContentLoaded', async () => {
    await handleLanguageChange()
})

// Manejador de eventos para el cambio de idioma
$select.addEventListener('change', handleLanguageChange)


// Banderas <img src=https://flagsapi.com/${countryCode}/flat/64.png>