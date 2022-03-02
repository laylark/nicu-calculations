const formulas = {
    enfamilEnfacare: {
        label: 'Enfamil Enfacare',
        kcalBase: 22,
        proteinRatio: .021,
        ironRatio: .013,
        vitDRatio: .56,
        kcalOptions: [22, 24, 26, 27, 28, 30],
    },
    similacNeosure: {
        label: 'Similac Neosure',
        kcalBase: 22,
        proteinRatio: .021,
        ironRatio: .013,
        vitDRatio: .52,
        kcalOptions: [22, 24, 26, 27, 28, 30],
    },
    similacSpecialCare: {
        label: 'Similac Special Care High Protein',
        kcalBase: 24,
        proteinRatio: [.021, .028, .03],
        ironRatio: .013,
        vitDRatio: .52,
        kcalOptions: [24, 27, 30],
    },
};

function load() {
    const formulaElement = document.getElementById("formula");
    for (const key in formulas) {
        const option = document.createElement("option");
        option.text = formulas[key].label;
        option.value = key;
        formulaElement.add(option);
    }

    // Create fake event to call onFormulaChange to load kcalOptions.
    const fakeEvent = {
        target: {
            value: formulaElement.value,
        },
    };

    onFormulaChange(fakeEvent);
}

load();

function onFormulaChange(event) {
    const formulaKey = event.target.value;
    const kcalOptions = formulas[formulaKey].kcalOptions;
    const kcalElement = document.getElementById("kcal");
    const currentKcalValue = parseInt(kcalElement.value);

    kcalElement.innerHTML = "";
    for (const item of kcalOptions) {
        const option = document.createElement("option");
        if (currentKcalValue === item) {
            option.selected = "selected";
        }
        option.text = item;
        option.value = item;
        kcalElement.add(option);
    }
}

function onDietChange(event) {
    const selectedDiet = event.target.value;
    console.log(selectedDiet);
    document.getElementById("formulaFields").classList.add("is-hidden");
    document.getElementById("mothersMilkFields").classList.add("is-hidden");
    
    const selectedFields = document.getElementById(selectedDiet + "Fields");
    if (selectedFields != null) {
        selectedFields.classList.remove("is-hidden");
    }
}

function calculate(event) {
    event.preventDefault();

    const weight = parseInt(document.getElementById("weight").value);
    const volume = parseInt(document.getElementById("volume").value);
    const kcal = parseInt(document.getElementById("kcal").value);
    const selectedFormula = document.getElementById("formula").value;
    const formulaData = formulas[selectedFormula];
    console.log(formulaData);

    const resultKcal = document.getElementById("resultKcal");
    const resultProtein = document.getElementById("resultProtein")
    
    const kcalPerOz = kcal / 30;
    const kcalPerKg = rounded(kcalPerOz * volume);
    resultKcal.innerHTML = kcalPerKg + " kcal/kg";

    const kcalRatio = kcal / formulaData.kcalBase;
    const proteinPerKg = rounded(volume * formulaData.proteinRatio * kcalRatio);
    resultProtein.innerHTML = proteinPerKg + " g/kg protein";

    const ironPerKg = rounded(volume * formulaData.ironRatio * kcalRatio);
    resultIron.innerHTML = ironPerKg + " mg/kg Fe";

    const vitD = rounded((volume * weight/1000) * formulaData.vitDRatio * kcalRatio, 0);
    resultVitD.innerHTML = vitD + " international units vit D";
}

function rounded(value, decimalPoints=1) {
    return value.toFixed(decimalPoints);
}