//testdata.js
var faker = require('faker');

class TestData {
    get randDeaths() { return faker.random.number({ min: 1, max: 4 }); }
    get randManyDeaths() { return faker.random.number({ min: 11, max: 99 }); }
    get randCondition() { return faker.random.arrayElement(['good', 'average', 'poor']); }
    get randHeads() { return faker.random.number({ min: 1, max: 100 }); }
    get randWeight() { return faker.random.number({ min: 1, max: 50 }); }
    get randMoveType() { return faker.random.arrayElement(['Transfer', 'Shipment',/*'Sale',*/ 'add', 'remov']); }
    get randComment() { return faker.lorem.sentence(); }
    get randGals() { return faker.random.number({ min: 1, max: 500 }); }
    get randDosage() {
        return faker.random.number({ min: 0, max: 10 })
            + '.' + faker.random.number({ min: 0, max: 9 })
                + faker.random.number({ min: 1, max: 9 });
    }
    get randHighTemp() {
        return faker.random.number({ min: 50, max: 99 })
            + '.' + faker.random.number({ min: 1, max: 9 });
    }
    get randLowTemp() {
        return faker.random.number({ min: 0, max: 49 })
            + '.' + faker.random.number({ min: 1, max: 9 });
    }
    get randWater() {
        return faker.random.number({ min: 0, max: 500 })
            + '.' + faker.random.number({ min: 1, max: 9 });
    }

    get randDiagnosType() { return faker.random.arrayElement(['Clinical', 'Lab Confirmed']); }
    rand(max) { return faker.random.number(max); }

    randArrayNumbers(max, length) { return Array.from(Array(length), () => this.rand(max)); }
    randArrayMoveTypes(length) { return Array.from(Array(length), () => this.randMoveType); }
    randArrayCondition(length) { return Array.from(Array(length), () => this.randCondition); }
    randArrayDeaths(length) { return Array.from(Array(length), () => this.randDeaths); }
    randArrayManyDeaths(length) { return Array.from(Array(length), () => this.randManyDeaths); }
    randArrayHeads(length) { return Array.from(Array(length), () => this.randHeads); }
    randArrayWeight(length) { return Array.from(Array(length), () => this.randWeight); }
    randArrayDosage(length) { return Array.from(Array(length), () => this.randDosage); }
    randArrayGals(length) { return Array.from(Array(length), () => this.randGals); }
    randArrayCcs(length) { return Array.from(Array(length), () => this.randCcs); }
    randArrayUnits(length) { return Array.from(Array(length), () => this.randUnits); }
    randArrayCheckups(length) { return Array.from(Array(length), () => this.randCheckupData); }
    randArrayComments(length) { return Array.from(Array(length), () => this.randComment); }
    randArrayDiagnosType(length) { return Array.from(Array(length), () => this.randDiagnosType); }
    randArrayPhoto(length) { return Array.from(Array(length), () => this.randPhoto); }
    randArrayVideo(length) { return Array.from(Array(length), () => this.randVideo); }
    randArrayAudio(length) { return Array.from(Array(length), () => this.randAudio); }

    randArrayTreats(length) {
        let mySet = new Set();
        for (let i = 0; i < length; i++) {
            mySet.add(this.randTreat);
            (mySet.size !== i + 1) && i--;
        }
        return Array.from(mySet);
    }

    randArraySymptom(length) {
        let mySet = new Set();
        for (let i = 0; i < length; i++) {
            mySet.add(this.randSymptom);
            (mySet.size !== i + 1) && i--;
        }
        return Array.from(mySet);
    }

    randArrayReason(length) {
        let mySet = new Set();
        for (let i = 0; i < length; i++) {
            mySet.add(this.randReason);
            (mySet.size !== i + 1) && i--;
        }
        return Array.from(mySet);
    }

    randArrayDisease(length) {
        let mySet = new Set();
        for (let i = 0; i < length; i++) {
            mySet.add(this.randDisease);
            (mySet.size !== i + 1) && i--;
        }
        return Array.from(mySet);
    }

    randMovesData() {
        return {
            amount: 5,
            type: ['Shipment', 'Transfer', 'add', 'remov', 'add'],
            heads: this.randArrayHeads(5),
            weight: this.randWeight,
            condition: this.randCondition,
            comment: this.randComment
        }
    }

    randDeathsData() {
        let data = new Object();
        data.reasons = this.randArrayReason(3);
        data.acute = [0, this.randDeaths, 0];
        data.chronic = [this.randDeaths, 0, 0];
        data.euthanas = [0, 0, this.randDeaths];
        data.comment = this.randComment;
        data.amount = data.acute[1] + data.chronic[0] + data.euthanas[2];

        return data;
    }

    randTreatsData() {
        let data = new Object();
        data.treats = [this.randCcs, this.randUnits, this.randMls, this.randNoDosage];
        data.heads = this.randArrayHeads(4);
        data.dosage = this.randArrayDosage(3);
        data.gals = this.randGals;
        data.total = Math.max(...data.heads) + Math.min(...data.heads);
        data.comment = this.randComment;
        data.amount = 4;

        return data;
    }

    randSymptData() {
        let data = new Object();
        data.sympt = this.randArraySymptom(4);
        data.comment = this.randComment;
        data.amount = 4;

        return data;
    }

    randDiagnosData() {
        let data = new Object();
        data.diseases = this.randArrayDisease(3);
        data.types = this.randArrayDiagnosType(3);
        data.comments = this.randArrayComments(3);
        data.amount = 3;

        return data;
    }

    get randCheckupData() {
        let data = new Object();
        let currAmount = Array.from(Array(4), () => this.rand(2) + 1 );
        data.moves = {
            amount: currAmount[0],
            type: this.randArrayMoveTypes(currAmount[0]),
            heads: this.randArrayHeads(currAmount[0]),
            weight: this.randArrayWeight(currAmount[0]),
            condition: this.randArrayCondition(currAmount[0]),
            comment: this.randComment
        }
        data.deaths = {
            reasons: this.randArrayReason(currAmount[1]),
            acute: this.randArrayDeaths(currAmount[1]),
            chronic: this.randArrayDeaths(currAmount[1]),
            euthanas: this.randArrayDeaths(currAmount[1]),
            comment: this.randComment
        }
        data.treats = {
            amount: currAmount[2],
            name: this.randArrayTreats(currAmount[2]),
            heads: this.randArrayHeads(currAmount[2]),
            dosage: this.randArrayDosage(currAmount[2]),
            gals: this.randArrayGals(currAmount[2]),
            comment: this.randComment
        }
        data.sympts = {
            amount: currAmount[3],
            name: this.randArraySymptom(currAmount[3]),
            comment: this.randComment
        }
        data.temps = {
            high: this.randHighTemp,
            low: this.randLowTemp,
            comment: this.randComment
        }
        data.water = {
            consumed: this.randWater,
            comment: this.randComment
        }
        data.files = {
            pic: this.randPhoto,
            video: this.randVideo,
            audio: this.randAudio
        }
        data.comment = this.randComment;

        return data;
    }

    calcDiffMoves(data) {
        let diff = 0;
        data.moves.heads.forEach((el, index) => {
            let type = data.moves.type[index];
            if ( type === 'Shipment' || type === 'add' ) {
                diff += (+el);
            } else {
                diff -= (+el);
            }
        });
        return diff;
    }

    toStringVal(myObj) {
        Object.keys(myObj).forEach(function(key) {
            typeof myObj[key] == 'object' ? this.toStringVal(myObj[key]) : myObj[key]= String(myObj[key]);
        }.bind(this));
    }

    //video - mov mp4 avi
    //audio - mp3 m4a aac webm wav
    //image - jpg jpeg gif png

    get randPhoto() {
        return faker.random.arrayElement(
            ["pig1.jpg", "pig2.jpg", "pig3.jpg", "pig4.jpeg", "pig5.jpg", 
            "pig6.jpg", "pig7.jpeg", "pig8.jpg", "pig9.jpg", "pig10.jpg",
            "pig11.jpg", "pig12.jpg", "pig13.jpg", "pig14.png", "pig15.png",
            "pig16.gif", "pig17.gif", "pig18.gif", "pig19.gif", "pig20.gif",
            "image_15MB.jpg", "image_1MB.gif", "image_5MB.jpg", "image_5MB.png"]
        );
    }

    get randVideo() {
        return faker.random.arrayElement(
            ["video_3MB.mp4", "video_5MB.mp4", "video_7MB.mp4", "video_18MB.mp4", 
            "video_2MB.mov", "video_3MB.mov", "video_5MB.mov", "video_7MB.mov",
            "video_1MB.avi", "video_2MB.avi", "video_3MB.avi", "video_4MB.avi"
            /*"video_1MB.mpg", "video_3MB.mpg", "video_4MB.mpg", "video_6MB.mpg"*/]
        );
    }

    get randAudio() {
        return faker.random.arrayElement(
            ["audio_0.2MB.mp3", "audio_0.5MB.mp3", "audio_0.7MB.mp3", "audio_1MB.mp3",
            "audio_1.1MB.mp3", "audio_1.2MB.mp3", "audio_3.6MB.mp3", "audio_4.7MB.mp3", 
            "audio_5MB.mp3", "audio_6MB.mp3", "audio_7MB.mp3", "audio_0.9MB.m4a",
            "audio_0.5MB.wav", "audio_3.5MB.wav", "audio_5.7MB.wav", "audio_10MB.wav",
            "audio_0.2MB.aac", "audio_0.5MB.aac", "audio_1.5MB.aac", "audio_3.8MB.aac",
            "audio_1.1MB.webm", "audio_1.5MB.webm", "audio_1.9MB.webm", "audio_2.5MB.webm" ]
        );
    }

    get randSymptom() {
        return faker.random.arrayElement(
            ["Abdomen bloated or distended", "Abnormally Lethargic/Inactive", "Abscesses",
                "Anaemia/Pale Pigs", "Blindness", "Blisters/Vesicles (nose, lips, feet)",
                "Blood in (normal) feces", "Blood in semen", "Blood on/in Skin, Vulva, Rectum",
                "Blood/Pus in Urine", "Conjunctivitis (discharges from eye)", "Constipation",
                "Coughing", "Decreased appetite", "Dehydration", "Diarrhea (General)",
                "Diarrhea (Watery)", "Diarrhea (with blood/mucus)", "Excessive Vocalization",
                "Feed Refusal", "Fever", "Fits/Convulsions", "Fractures", "Gangrene/Necrosis (rotting skin)",
                "Gaunt/Thin/Skinny", "Hairy Pigs", "Head on one side", "Hemorrhage",
                "Lameness/Stiffness/Arthritis", "Loss of Coordination", "Lymph nodes enlarged",
                "Meningitis/Jerky eye movements", "Mucus/Pus in urine", "Mucus/pus or blood from the nose",
                "Mucus/pus or blood from vulva", "Nasal Discharge", "Nose Deformed", "Other",
                "Pain", "Paralysis/Dog Sitting Position", "Pneumonia/Rapid Breathing",
                "Poor Growth/Wasting/Starvation", "Poor Viable/Hypothermia/Splay Legs",
                "Salivation", "Scratching/rubbing/irritation of the skin", "Shivering",
                "Skin: Black, Brown or Red lesions", "Skin: Blue", "Skin: Greasy Brown",
                "Skin: Jaundice (Yellow)", "Skin: Raised Patches", "Skin: Ulcerated/Inflamed/Detmatitis",
                "Sneezing", "Swellings/Oedema", "Tail Bite", "Thumping/Labored Breathing",
                "Trembling/Shaking", "Urine (chalky/abnormal color)", "Vomiting"]
        );
    }

    get randReason() {
        return faker.random.arrayElement(
            ["Abcess", "Accident", "Actinobaccilus pleuropneumoniae", "Actinobaccilus suis", "Bleeding",
                "Cannibalism", "Coccidiosis", "Diarrhea", "E coli", "Erysipelas", "Fighting", "Greasy Pig",
                "Haemophilus Parasuis", "Heart Failure", "Hemorrhagic Bowel", "Hernia, scrotel (rupture)",
                "Ileitis", "Injury/Trauma", "Joint Infection", "Lameness", "Lawsonia", "Mcyoplasma Hyorhinis",
                "Meningitis", "Mycoplasma Hyopneumoniae", /*"Pneumonia",*/ "Prolaspe, rectal", "Rectal Stricture (blind anus)",
                "Respiratory", "Runt", "Salmonella", "Septicemia", "Starvation", "Streptococcus Suis", "Suffocation",
                "Swine Dysentery", "Swine Influenza", "TGE", "Tail Biting", "Toxicity", "Twisted Gut", "Ulcer", "Water Deprivation"]
        );
    }

    get randTreat() {
        return faker.random.arrayElement(
            ["3FLEX® 250", "3FLEX® 50", "Activate® 1 Gal", "Activate® 5 Gal", "Aivlosin® 160",
                "Aivlosin® 400", "Amoxicillin Sol.", "Amoxicillin Sol. RED 187.5", "Amoxicillin Sol. RED 37.5",
                "Apple Cider Vinegar", "Apple Cider Vinegar Oral", "Aspirin Liquid Concentrate + Caffeine",
                "Aspirin, Liquid Concentrate", "BVS Concentrate", "Baytril® 100 Injectable Solution",
                "Blue 2 Liquid", "Bluelite-Swine®", "Ceftiflex®", "Circumvent® PCV G2 100",
                "Circumvent® PCV G2 500", "Circumvent® PCV-M G2 100", "Circumvent® PCV-M G2 500",
                "Citric Acid", "Denagard™ 12.5% 1L", "Denagard™ 12.5% 5L", "Dexamethasone (ml)",
                "Draxxin®", "EQUISUL-SDT® 900", "EXCENEL® RTU EZ", "Edema Vac and Entero Vac 100 ML",
                "Edema Vac and Entero Vac 200 ML", "Edema Vac and Entero Vac 500 ML", "Edema Vac® 100",
                "Emcelle® E-D3 Liquid", "Enroflox 100", "Enterisol Salmonella T/C 100 Dose / 200 ML",
                "Enterisol Salmonella T/C 500 Dose / 200 ML", "Enterisol® Ileitis", "Entero Vac® 100",
                "Excede® For Swine", "Excenel® RTU", "F-18 / K-88 Mix", "FLEXCombo® 250", "FLEXCombo® 50",
                "FURST WATER BOOST™", "Florcon", "Flunixin Injection - S", "GEN-GARD®", "GentaMed™ Soluble Powder",
                "Gentle Iodine Wound Spray 1 Gallon", "Gentle Iodine Wound Spray 16 oz",
                "Gentocin Injectable Solution", "Ingelvac CircoFLEX® 100", "Ingelvac CircoFLEX® 250",
                "Ingelvac CircoFLEX® 50", "Ingelvac MycoFLEX® 100", "Ingelvac MycoFLEX® 250",
                "Ingelvac MycoFLEX® 50", "Ingelvac PRRS® MLV 10", "Ingelvac PRRS® MLV 100",
                "Ingelvac PRRS® MLV 250", "Ingelvac PRRS® MLV 50", "Ingelvac® ERY-ALC",
                "LINCOMIX® Soluble Powder 160", "LINCOMIX® Soluble Powder 480", "Linco Soluble",
                "LincoMed® 100", "LincoMed® 300", "Liquitein® 2.5 Gal", "Liquitein® 5 Gal",
                "Myco/Circo Mix", "Myco/Circo/PRRS Mix", "Naxcel® Sterile Powder 1 Gram",
                "Naxcel® Sterile Powder 4 Gram", "Neo-Sol® 50", "Neomycin 325",
                "Oral-Pro Sodium Salicylate Concentrate 48.6%", "Oral-Pro Vitamin D3 plus E500",
                "Oxytetracycline Injection 200", "Penicillin G Procaine Aqueous Suspension",
                "Pennchlor™ 64", "Pennox 343®", "Porcilis® ILEITIS 100", "Porcilis® ILEITIS 500",
                "Pulmotil® AC", "R-Pen®", "Terra-Vet® 200", "Terra-Vet® 250", "Terra-Vet® 500",
                "Tylan® 200 Injection", "Tylan® Soluble", "Virkon Disinfectant"]
        );
    }

    get randCcs() {
        return faker.random.arrayElement(
            ['3FLEX® 250', '3FLEX® 50', 'Baytril® 100 Injectable Solution', 'Ceftiflex®',
                'Circumvent® PCV G2 100', 'Circumvent® PCV G2 500', 'Circumvent® PCV-M G2 100',
                'Circumvent® PCV-M G2 500', 'Dexamethasone (ml)', 'Draxxin®', 'EXCENEL® RTU EZ',
                'Enroflox 100', 'Excede® For Swine', 'Excenel® RTU', 'F-18 / K-88 Mix',
                'FLEXCombo® 250', 'FLEXCombo® 50', 'Flunixin Injection - S', 'Gentocin Injectable Solution',
                'Ingelvac CircoFLEX® 100', 'Ingelvac CircoFLEX® 250', 'Ingelvac CircoFLEX® 50',
                'Ingelvac MycoFLEX® 100', 'Ingelvac MycoFLEX® 250', 'Ingelvac MycoFLEX® 50',
                'Ingelvac PRRS® MLV 10', 'Ingelvac PRRS® MLV 100', 'Ingelvac PRRS® MLV 250',
                'Ingelvac PRRS® MLV 50', 'LincoMed® 100', 'LincoMed® 300', 'Myco/Circo Mix',
                'Myco/Circo/PRRS Mix', 'Naxcel® Sterile Powder 1 Gram', 'Naxcel® Sterile Powder 4 Gram',
                'Oxytetracycline Injection 200', 'Penicillin G Procaine Aqueous Suspension',
                'Porcilis® ILEITIS 100', 'Porcilis® ILEITIS 500', 'Terra-Vet® 200',
                'Terra-Vet® 250', 'Terra-Vet® 500', 'Tylan® 200 Injection']
        );
    }

    get randUnits() {
        return faker.random.arrayElement(
            ['Activate® 1 Gal', 'Activate® 5 Gal', 'Aivlosin® 160', 'Aivlosin® 400',
                'Amoxicillin Sol.', 'Amoxicillin Sol. RED 187.5', 'Amoxicillin Sol. RED 37.5',
                'Apple Cider Vinegar Oral', 'Aspirin Liquid Concentrate + Caffeine',
                'Aspirin, Liquid Concentrate', 'BVS Concentrate', 'Blue 2 Liquid',
                'Bluelite-Swine®', 'Citric Acid', 'Denagard™ 12.5% 1L', 'Denagard™ 12.5% 5L',
                'EQUISUL-SDT® 900', 'Edema Vac and Entero Vac 100 ML', 'Edema Vac and Entero Vac 200 ML',
                'Edema Vac and Entero Vac 500 ML', 'Emcelle® E-D3 Liquid', 'Enterisol® Ileitis',
                'FURST WATER BOOST™', 'Florcon', 'GEN-GARD®', 'GentaMed™ Soluble Powder',
                'Ingelvac® ERY-ALC', 'LINCOMIX® Soluble Powder 160', 'LINCOMIX® Soluble Powder 480',
                'Linco Soluble', 'Liquitein® 2.5 Gal', 'Liquitein® 5 Gal',
                'Neo-Sol® 50', 'Neomycin 325', 'Oral-Pro Sodium Salicylate Concentrate 48.6%',
                'Oral-Pro Vitamin D3 plus E500', 'Pennchlor™ 64', 'Pennox 343®',
                'Pulmotil® AC', 'R-Pen®', 'Tylan® Soluble']
        );
    }

    get randMls() {
        return faker.random.arrayElement(
            ['Edema Vac® 100', 'Enterisol Salmonella T/C 100 Dose / 200 ML',
                'Enterisol Salmonella T/C 500 Dose / 200 ML', 'Entero Vac® 100']
        );
    }

    get randNoDosage() {
        return faker.random.arrayElement(
            [ /*'Apple Cider Vinegar',*/ 'Gentle Iodine Wound Spray 16 oz',
                'Gentle Iodine Wound Spray 1 Gallon', 'Virkon Disinfectant']
        );
    }

    get randDisease() {
        return faker.random.arrayElement(
            ['APP', 'Actinobacillus suis', 'Aflatoxicosis', 'African swine fever',
                'Ammonia Toxicity', 'Anthrax', 'Atresia Ani', 'Progressive Atrophic Rhinitis',
                'Aural (Ear) Hematoma', 'Paramyxovirus', 'Swine Brucellosis',
                'Carbon Monoxide Toxicity', 'Hog Cholera', 'Clostridial Diarrhea',
                'Coccidiosis', 'Cocklebur Poisoning', 'E. coli diarrhea',
                'Cystitis and Pyelonephritis', 'DON, vomitoxin', 'Dermatosis Vegetans',
                'Ectopic Ossification of Mesentery', 'Edema disease', 'EMC',
                'Epitheliogenesis Imperfecta', 'Ergotism', 'Erysipelas',
                'Exudative epidermitis - Greasy Pig', 'FMD', 'Fumonisin Toxicosis',
                'Gongylonema pulchrum', 'Glasser’s Disease', 'Vomiting and Wasting Disease',
                'HBS', 'Hernias, Inguinal and Umbilical', 'Globocephalus urosubulatus',
                'Hydrogen Sulfide Toxicity', 'Hydronephrosis', 'MMA',
                'Hypoglycemia in Neonatal Piglets', 'Porcine Cytomegalovirus Infection',
                'Swine Influenza; Swine Flu', 'Goiter', 'Iron Deficiency Anemia',
                'Japanese B Encephalitis', 'Kidney Worm Infection', 'Leptospirosis',
                'Fasciola hepatica', 'Pediculosis', 'Metastrongylosis', 'Sarcoptic Mange',
                'Megacolon', 'Mortality in Sows', 'Mycoplasmal polyserositis/arthritis',
                'Mycoplasmal arthritis', 'Enzootic Pneumonia', 'Eperythrozoonosis',
                'Mycotoxicoses', 'Oesophagostomiasis', 'Osteochondrosis', 'Parakeratosis',
                'Parvovirus', 'Organic Arsenical', 'Pigweed Poisoning', 'Pityriasis Rosea',
                'Pasteurellosis; Pasteurella multocida; also see Atrophic Rhinitis',
                'PCVD, PCVAD', 'PED', 'Enteroviruses', 'PRRS', 'Porcine Stress Syndrome',
                'Taenia solium', 'Swine Pox', 'Prolapses',
                'Porcine Proliferative Enteritis, Ileitis, Intestinal Adenomatosis, Garden-hose Gut',
                'Pseudorabies - PRV', 'Pustular Dermatitis', 'Rabies', 'Hyostrongylus rubidus',
                'Rickets and Osteoporosis', 'Ringworm', 'Rotaviral Enteritis',
                'Ascariasis', 'Colitis', 'Water Deprivation; Sodium Ion Toxicosis',
                'Septic arthritis', 'Shoulder Ulcers in Sows', 'Skin Necrosis of Piglets',
                'Spraddleleg', 'Streptococcus suis Infection', 'Sunburn and Photosensitization',
                'Swine Dysentery and Spirochaetal Colitis', 'T-2 toxin',
                'Ascarops strongylinaand Physocephalus sexalatus',
                'Thorny-headed Worm Infection', 'Strongyloidosis', 'Torsion and Volvulus',
                'TGE', 'Trichinella spiralis', 'Trichinosis', 'Trichothecene Toxicoses',
                'Tuberculosis', 'Gastric Ulcers; Ulcers', 'San Miguel Sea Lion Viral Disease',
                'Vesicular Stomatitis', 'Vestibular Syndrome',
                'Tail Biting, Ear Biting, Flank Biting, Navel Sucking',
                'Vitamin E/Selenium Deficiency', 'West Nile Virus',
                'Whipworm Infection', 'F-2']
        );
    }
}

module.exports = new TestData();