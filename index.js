const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

function getCombinations(arr) {
    const results = [];

    const recurse = (start, current) => {
        const totalWeight = current.reduce((sum, e) => sum + e.peso, 0);
        const totalCalories = current.reduce((sum, e) => sum + e.calorias, 0);
        results.push({ elementos: [...current], pesoTotal: totalWeight, caloriasTotales: totalCalories });

        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            recurse(i + 1, current);
            current.pop();
        }
    };

    recurse(0, []);
    return results;
}

app.post('/api/combination', (req, res) => {
    const { elements, minCalories, maxWeight } = req.body;

    const allCombinations = getCombinations(elements);

    const validCombinations = allCombinations.filter(
        combo => combo.pesoTotal <= maxWeight && combo.caloriasTotales >= minCalories
    );

    const opciones = validCombinations.map((combo, index) => ({
        opcion: `Opción ${index + 1}`,
        pesoTotal: combo.pesoTotal,
        caloriasTotales: combo.caloriasTotales,
        elementos: combo.elementos,
    }));

    res.json(opciones);
});


const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
