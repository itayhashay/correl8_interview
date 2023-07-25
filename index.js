const fs = require('fs'),
    csvParser = require('csv-parser'),
    axios = require('axios');

const urlData = {
    baseURL: "https://api.exchangeratesapi.io/latest",
    access_key: "d6943c813d6c3a3d1ca6793e8232a096"
};

const correncyDict = [];

const csvReader = () => {
    fs.createReadStream('./currency-conversion.csv').pipe(csvParser({ separator: ',' }))
        .on('data', async (row) => {
            let res = correncyDict.find(obj => obj.Target === row.Target && row.Base === row.Base);
            
            if (!res) {
                let {data} = await axios.get(`${urlData.baseURL}?base=${row.Base}&symbols=${row.Target}&access_key=${urlData.access_key}`);
                res = {
                    Success: data.success,
                    Target: row.Target,
                    Base: row.Base,
                    BaseToTargert: data.success ? data.rates[row.Target] : data.error.info
                } 
                correncyDict.push(res);
            }
            
            console.log({
                base: row.Base,
                target: row.Target,
                amount: row.Sum,
                result: res.Success ? res.BaseToTargert * row.Sum : res.BaseToTargert
            });
        })
        
}

csvReader();