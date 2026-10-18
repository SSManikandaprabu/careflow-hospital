export interface Medication {
  id: string;
  name: string;
  dosage: string;
  category: string;
  stock: number;
  priceINR: number;
}

const PHARMA_CLASSES = [
  {
    category: 'Cardiovascular & Hypertension',
    drugs: [
      { name: 'Amlodipine', dosages: ['2.5mg', '5mg', '10mg'], basePrice: 45 },
      { name: 'Telmisartan', dosages: ['20mg', '40mg', '80mg'], basePrice: 85 },
      { name: 'Losartan Potassium', dosages: ['25mg', '50mg'], basePrice: 60 },
      { name: 'Atenolol', dosages: ['25mg', '50mg'], basePrice: 38 },
      { name: 'Metoprolol Succinate', dosages: ['25mg', '50mg', '100mg'], basePrice: 95 },
      { name: 'Ramipril', dosages: ['2.5mg', '5mg', '10mg'], basePrice: 70 },
      { name: 'Enalapril Maleate', dosages: ['5mg', '10mg'], basePrice: 50 },
      { name: 'Hydrochlorothiazide', dosages: ['12.5mg', '25mg'], basePrice: 32 },
      { name: 'Chlorthalidone', dosages: ['6.25mg', '12.5mg'], basePrice: 55 },
      { name: 'Furosemide', dosages: ['20mg', '40mg'], basePrice: 28 },
      { name: 'Torsemide', dosages: ['10mg', '20mg'], basePrice: 65 },
      { name: 'Spironolactone', dosages: ['25mg', '50mg'], basePrice: 80 },
      { name: 'Diltiazem SR', dosages: ['30mg', '60mg', '90mg'], basePrice: 90 },
      { name: 'Verapamil', dosages: ['40mg', '80mg'], basePrice: 48 },
      { name: 'Digoxin', dosages: ['0.25mg'], basePrice: 22 },
      { name: 'Ivabradine', dosages: ['5mg', '7.5mg'], basePrice: 160 },
      { name: 'Sacubitril + Valsartan', dosages: ['50mg', '100mg', '200mg'], basePrice: 380 },
      { name: 'Nitroglycerin Sublingual', dosages: ['0.5mg'], basePrice: 85 },
      { name: 'Isosorbide Mononitrate', dosages: ['20mg', '30mg', '60mg'], basePrice: 75 },
      { name: 'Clopidogrel', dosages: ['75mg'], basePrice: 95 },
      { name: 'Aspirin Gastro-resistant', dosages: ['75mg', '150mg'], basePrice: 35 },
      { name: 'Ticagrelor', dosages: ['90mg'], basePrice: 240 },
      { name: 'Prasugrel', dosages: ['10mg'], basePrice: 180 },
      { name: 'Warfarin Sodium', dosages: ['2mg', '5mg'], basePrice: 65 },
      { name: 'Acenocoumarol', dosages: ['1mg', '2mg', '4mg'], basePrice: 90 },
      { name: 'Rivaroxaban', dosages: ['10mg', '15mg', '20mg'], basePrice: 420 },
      { name: 'Apixaban', dosages: ['2.5mg', '5mg'], basePrice: 450 },
      { name: 'Dabigatran', dosages: ['110mg', '150mg'], basePrice: 480 },
    ]
  },
  {
    category: 'Endocrinology & Diabetes',
    drugs: [
      { name: 'Metformin Hydrochloride', dosages: ['500mg', '850mg', '1000mg'], basePrice: 40 },
      { name: 'Metformin SR', dosages: ['500mg', '1000mg'], basePrice: 48 },
      { name: 'Glimepiride', dosages: ['1mg', '2mg', '3mg', '4mg'], basePrice: 65 },
      { name: 'Gliclazide MR', dosages: ['30mg', '60mg'], basePrice: 90 },
      { name: 'Glipizide', dosages: ['5mg'], basePrice: 35 },
      { name: 'Vildagliptin', dosages: ['50mg'], basePrice: 140 },
      { name: 'Sitagliptin', dosages: ['50mg', '100mg'], basePrice: 180 },
      { name: 'Teneligliptin', dosages: ['20mg'], basePrice: 110 },
      { name: 'Linagliptin', dosages: ['5mg'], basePrice: 210 },
      { name: 'Dapagliflozin', dosages: ['5mg', '10mg'], basePrice: 220 },
      { name: 'Empagliflozin', dosages: ['10mg', '25mg'], basePrice: 240 },
      { name: 'Canagliflozin', dosages: ['100mg'], basePrice: 260 },
      { name: 'Pioglitazone', dosages: ['15mg', '30mg'], basePrice: 75 },
      { name: 'Voglibose', dosages: ['0.2mg', '0.3mg'], basePrice: 85 },
      { name: 'Acarbose', dosages: ['50mg'], basePrice: 95 },
      { name: 'Human Insulin Regular 40IU/ml', dosages: ['10ml Vial'], basePrice: 165 },
      { name: 'Insulin Glargine Pen', dosages: ['100IU/ml 3ml'], basePrice: 650 },
      { name: 'Insulin Degludec', dosages: ['100IU/ml'], basePrice: 820 },
      { name: 'Levothyroxine Sodium', dosages: ['25mcg', '50mcg', '75mcg', '100mcg', '125mcg'], basePrice: 125 },
      { name: 'Carbimazole', dosages: ['5mg', '10mg'], basePrice: 95 },
      { name: 'Propylthiouracil', dosages: ['50mg'], basePrice: 140 },
    ]
  },
  {
    category: 'Antibiotics & Antimicrobials',
    drugs: [
      { name: 'Amoxicillin', dosages: ['250mg', '500mg'], basePrice: 85 },
      { name: 'Amoxicillin + Potassium Clavulanate', dosages: ['375mg', '625mg', '1000mg'], basePrice: 195 },
      { name: 'Azithromycin', dosages: ['250mg', '500mg'], basePrice: 115 },
      { name: 'Clarithromycin', dosages: ['250mg', '500mg'], basePrice: 220 },
      { name: 'Roxithromycin', dosages: ['150mg'], basePrice: 90 },
      { name: 'Ciprofloxacin', dosages: ['250mg', '500mg'], basePrice: 65 },
      { name: 'Levofloxacin', dosages: ['250mg', '500mg', '750mg'], basePrice: 110 },
      { name: 'Ofloxacin', dosages: ['200mg', '400mg'], basePrice: 80 },
      { name: 'Norfloxacin', dosages: ['400mg'], basePrice: 60 },
      { name: 'Cefixime', dosages: ['100mg', '200mg'], basePrice: 140 },
      { name: 'Cefuroxime Axetil', dosages: ['250mg', '500mg'], basePrice: 260 },
      { name: 'Cefpodoxime Proxetil', dosages: ['100mg', '200mg'], basePrice: 210 },
      { name: 'Cephalexin', dosages: ['250mg', '500mg'], basePrice: 120 },
      { name: 'Ceftriaxone Dry Inj', dosages: ['500mg', '1000mg'], basePrice: 85 },
      { name: 'Cefoperazone + Sulbactam Inj', dosages: ['1.5g'], basePrice: 280 },
      { name: 'Piperacillin + Tazobactam Inj', dosages: ['4.5g'], basePrice: 420 },
      { name: 'Meropenem Trihydrate Inj', dosages: ['500mg', '1g'], basePrice: 690 },
      { name: 'Doxycycline Hcl', dosages: ['100mg'], basePrice: 55 },
      { name: 'Minocycline', dosages: ['50mg', '100mg'], basePrice: 180 },
      { name: 'Metronidazole', dosages: ['200mg', '400mg'], basePrice: 32 },
      { name: 'Tinidazole', dosages: ['300mg', '500mg'], basePrice: 45 },
      { name: 'Linezolid', dosages: ['600mg'], basePrice: 310 },
      { name: 'Vancomycin Inj', dosages: ['500mg', '1g'], basePrice: 450 },
      { name: 'Cotrimoxazole (Sulfamethoxazole + Trimethoprim)', dosages: ['Double Strength'], basePrice: 42 },
      { name: 'Nitrofurantoin SR', dosages: ['100mg'], basePrice: 125 },
      { name: 'Fluconazole', dosages: ['150mg', '200mg', '400mg'], basePrice: 65 },
      { name: 'Itraconazole', dosages: ['100mg', '200mg'], basePrice: 240 },
      { name: 'Voriconazole', dosages: ['200mg'], basePrice: 850 },
      { name: 'Terbinafine', dosages: ['250mg'], basePrice: 175 },
      { name: 'Acyclovir', dosages: ['200mg', '400mg', '800mg'], basePrice: 95 },
      { name: 'Valacyclovir', dosages: ['500mg', '1000mg'], basePrice: 320 },
      { name: 'Oseltamivir Phosphate', dosages: ['75mg'], basePrice: 450 },
    ]
  },
  {
    category: 'Gastroenterology & Hepatology',
    drugs: [
      { name: 'Pantoprazole Gastro-Resistant', dosages: ['20mg', '40mg'], basePrice: 75 },
      { name: 'Rabeprazole Sodium', dosages: ['20mg'], basePrice: 85 },
      { name: 'Esomeprazole Magnesium', dosages: ['20mg', '40mg'], basePrice: 110 },
      { name: 'Omeprazole', dosages: ['20mg'], basePrice: 45 },
      { name: 'Lansoprazole', dosages: ['15mg', '30mg'], basePrice: 70 },
      { name: 'Famotidine', dosages: ['20mg', '40mg'], basePrice: 35 },
      { name: 'Ranitidine Hcl', dosages: ['150mg'], basePrice: 28 },
      { name: 'Domperidone', dosages: ['10mg'], basePrice: 38 },
      { name: 'Itopride Hcl', dosages: ['50mg'], basePrice: 95 },
      { name: 'Levosulpiride', dosages: ['25mg', '75mg'], basePrice: 120 },
      { name: 'Ondansetron', dosages: ['4mg', '8mg'], basePrice: 48 },
      { name: 'Metoclopramide', dosages: ['10mg'], basePrice: 22 },
      { name: 'Granisetron', dosages: ['1mg', '2mg'], basePrice: 85 },
      { name: 'Dicyclomine Hcl', dosages: ['10mg', '20mg'], basePrice: 30 },
      { name: 'Drotaverine Hcl', dosages: ['40mg', '80mg'], basePrice: 75 },
      { name: 'Mebeverine SR', dosages: ['200mg'], basePrice: 185 },
      { name: 'Loperamide', dosages: ['2mg'], basePrice: 24 },
      { name: 'Racecadotril', dosages: ['100mg'], basePrice: 95 },
      { name: 'Lactulose Oral Solution', dosages: ['100ml', '200ml'], basePrice: 160 },
      { name: 'Polyethylene Glycol (PEG)', dosages: ['Sachet 17g'], basePrice: 85 },
      { name: 'Sodium Picosulfate', dosages: ['10mg'], basePrice: 65 },
      { name: 'Sucralfate Suspension', dosages: ['100ml', '200ml'], basePrice: 145 },
      { name: 'Ursodeoxycholic Acid', dosages: ['150mg', '300mg'], basePrice: 320 },
      { name: 'L-Ornithine L-Aspartate', dosages: ['150mg', '300mg'], basePrice: 280 },
      { name: 'Rifaximin', dosages: ['200mg', '400mg', '550mg'], basePrice: 290 },
      { name: 'Mesalamine Gastro-resistant', dosages: ['400mg', '800mg', '1.2g'], basePrice: 340 },
    ]
  },
  {
    category: 'Neurology & Psychiatry',
    drugs: [
      { name: 'Levetiracetam', dosages: ['250mg', '500mg', '750mg', '1000mg'], basePrice: 190 },
      { name: 'Sodium Valproate Chrono', dosages: ['200mg', '300mg', '500mg'], basePrice: 145 },
      { name: 'Carbamazepine CR', dosages: ['100mg', '200mg', '400mg'], basePrice: 85 },
      { name: 'Oxcarbazepine', dosages: ['150mg', '300mg', '600mg'], basePrice: 160 },
      { name: 'Phenytoin Sodium', dosages: ['50mg', '100mg'], basePrice: 65 },
      { name: 'Lamotrigine', dosages: ['25mg', '50mg', '100mg'], basePrice: 130 },
      { name: 'Topiramate', dosages: ['25mg', '50mg'], basePrice: 110 },
      { name: 'Gabapentin', dosages: ['100mg', '300mg', '400mg'], basePrice: 140 },
      { name: 'Pregabalin', dosages: ['75mg', '150mg'], basePrice: 165 },
      { name: 'Escitalopram Oxalate', dosages: ['5mg', '10mg', '20mg'], basePrice: 95 },
      { name: 'Sertraline Hcl', dosages: ['25mg', '50mg', '100mg'], basePrice: 115 },
      { name: 'Fluoxetine', dosages: ['10mg', '20mg'], basePrice: 60 },
      { name: 'Paroxetine CR', dosages: ['12.5mg', '25mg'], basePrice: 145 },
      { name: 'Duloxetine Gastro-resistant', dosages: ['20mg', '30mg', '60mg'], basePrice: 170 },
      { name: 'Venlafaxine ER', dosages: ['37.5mg', '75mg', '150mg'], basePrice: 160 },
      { name: 'Mirtazapine', dosages: ['7.5mg', '15mg', '30mg'], basePrice: 135 },
      { name: 'Amitriptyline Hcl', dosages: ['10mg', '25mg'], basePrice: 42 },
      { name: 'Nortriptyline', dosages: ['25mg'], basePrice: 50 },
      { name: 'Clonazepam', dosages: ['0.25mg', '0.5mg', '1mg', '2mg'], basePrice: 55 },
      { name: 'Lorazepam', dosages: ['1mg', '2mg'], basePrice: 48 },
      { name: 'Alprazolam', dosages: ['0.25mg', '0.5mg'], basePrice: 38 },
      { name: 'Zolpidem Tartrate', dosages: ['5mg', '10mg'], basePrice: 85 },
      { name: 'Olanzapine', dosages: ['2.5mg', '5mg', '10mg'], basePrice: 80 },
      { name: 'Quetiapine Fumarate', dosages: ['25mg', '50mg', '100mg', '200mg'], basePrice: 125 },
      { name: 'Risperidone', dosages: ['1mg', '2mg', '3mg'], basePrice: 65 },
      { name: 'Aripiprazole', dosages: ['5mg', '10mg', '15mg'], basePrice: 155 },
      { name: 'Donepezil Hcl', dosages: ['5mg', '10mg'], basePrice: 180 },
      { name: 'Memantine Hcl', dosages: ['5mg', '10mg'], basePrice: 210 },
      { name: 'Baclofen', dosages: ['10mg', '25mg'], basePrice: 95 },
      { name: 'Levodopa + Carbidopa', dosages: ['100mg/25mg', '250mg/25mg'], basePrice: 175 },
      { name: 'Pramipexole', dosages: ['0.125mg', '0.25mg', '0.5mg'], basePrice: 130 },
      { name: 'Propranolol Hcl', dosages: ['10mg', '20mg', '40mg'], basePrice: 40 },
      { name: 'Flunarizine', dosages: ['5mg', '10mg'], basePrice: 65 },
    ]
  },
  {
    category: 'Respiratory & Pulmonology',
    drugs: [
      { name: 'Salbutamol / Albuterol Inhaler', dosages: ['100mcg (200 MDI doses)'], basePrice: 160 },
      { name: 'Levosalbutamol Respules', dosages: ['0.63mg', '1.25mg'], basePrice: 45 },
      { name: 'Ipratropium Bromide Respules', dosages: ['250mcg', '500mcg'], basePrice: 55 },
      { name: 'Budesonide Inhalation Susp', dosages: ['0.5mg/2ml', '1mg/2ml'], basePrice: 68 },
      { name: 'Budesonide + Formoterol Inhaler', dosages: ['100mcg/6mcg', '200mcg/6mcg', '400mcg/6mcg'], basePrice: 380 },
      { name: 'Fluticasone Propionate Inhaler', dosages: ['125mcg', '250mcg'], basePrice: 340 },
      { name: 'Fluticasone + Salmeterol Rotacaps', dosages: ['100mcg', '250mcg', '500mcg'], basePrice: 290 },
      { name: 'Tiotropium Bromide Rotacaps', dosages: ['18mcg'], basePrice: 320 },
      { name: 'Montelukast Sodium', dosages: ['4mg', '5mg', '10mg'], basePrice: 95 },
      { name: 'Montelukast + Levocetirizine', dosages: ['10mg/5mg'], basePrice: 135 },
      { name: 'Levocetirizine Dihydrochloride', dosages: ['5mg'], basePrice: 45 },
      { name: 'Cetirizine Hydrochloride', dosages: ['10mg'], basePrice: 35 },
      { name: 'Fexofenadine Hydrochloride', dosages: ['120mg', '180mg'], basePrice: 120 },
      { name: 'Bilastine', dosages: ['20mg'], basePrice: 165 },
      { name: 'Hydroxyzine Hcl', dosages: ['10mg', '25mg'], basePrice: 55 },
      { name: 'Doxofylline', dosages: ['400mg'], basePrice: 110 },
      { name: 'Acebrophylline', dosages: ['100mg'], basePrice: 145 },
      { name: 'N-Acetylcysteine Effervescent', dosages: ['600mg'], basePrice: 180 },
      { name: 'Ambroxol Hcl Syrup', dosages: ['100ml'], basePrice: 75 },
      { name: 'Dextromethorphan Hbr Syrup', dosages: ['100ml'], basePrice: 85 },
      { name: 'Codeine Phosphate Syrup', dosages: ['100ml (Restricted)'], basePrice: 140 },
    ]
  },
  {
    category: 'Analgesics, Orthopedics & Anti-Inflammatory',
    drugs: [
      { name: 'Paracetamol / Acetaminophen', dosages: ['500mg', '650mg'], basePrice: 30 },
      { name: 'Paracetamol IV Infusion', dosages: ['1000mg/100ml'], basePrice: 95 },
      { name: 'Ibuprofen', dosages: ['200mg', '400mg'], basePrice: 32 },
      { name: 'Diclofenac Sodium Gastro-resistant', dosages: ['50mg'], basePrice: 38 },
      { name: 'Diclofenac Potassium + Paracetamol', dosages: ['50mg/325mg'], basePrice: 58 },
      { name: 'Aceclofenac', dosages: ['100mg'], basePrice: 62 },
      { name: 'Aceclofenac + Paracetamol', dosages: ['100mg/325mg'], basePrice: 75 },
      { name: 'Aceclofenac + Paracetamol + Serratiopeptidase', dosages: ['100/325/15mg'], basePrice: 115 },
      { name: 'Naproxen', dosages: ['250mg', '500mg'], basePrice: 85 },
      { name: 'Piroxicam Dispersible', dosages: ['20mg'], basePrice: 60 },
      { name: 'Etoricoxib', dosages: ['60mg', '90mg', '120mg'], basePrice: 135 },
      { name: 'Celecoxib', dosages: ['100mg', '200mg'], basePrice: 150 },
      { name: 'Tramadol Hydrochloride', dosages: ['50mg'], basePrice: 65 },
      { name: 'Tramadol + Paracetamol', dosages: ['37.5mg/325mg'], basePrice: 95 },
      { name: 'Thiocolchicoside (Muscle Relaxant)', dosages: ['4mg', '8mg'], basePrice: 165 },
      { name: 'Chlorzoxazone', dosages: ['250mg', '500mg'], basePrice: 75 },
      { name: 'Colchicine', dosages: ['0.5mg'], basePrice: 68 },
      { name: 'Allopurinol', dosages: ['100mg', '300mg'], basePrice: 80 },
      { name: 'Febuxostat', dosages: ['40mg', '80mg'], basePrice: 130 },
      { name: 'Calcium Carbonate + Vitamin D3', dosages: ['500mg/250IU', '500mg/500IU'], basePrice: 95 },
      { name: 'Cholecalciferol (Vitamin D3) Sachet', dosages: ['60,000 IU'], basePrice: 42 },
      { name: 'Glucosamine Sulfate + Chondroitin', dosages: ['750mg/600mg'], basePrice: 240 },
      { name: 'Diacerein', dosages: ['50mg'], basePrice: 195 },
      { name: 'Alendronate Sodium', dosages: ['70mg (Weekly)'], basePrice: 175 },
      { name: 'Zoledronic Acid IV', dosages: ['4mg/5mg'], basePrice: 2800 },
      { name: 'Methotrexate', dosages: ['2.5mg', '5mg', '7.5mg', '10mg'], basePrice: 120 },
      { name: 'Hydroxychloroquine Sulfate', dosages: ['200mg', '400mg'], basePrice: 145 },
      { name: 'Leflunomide', dosages: ['10mg', '20mg'], basePrice: 190 },
      { name: 'Sulfasalazine Delayed-Release', dosages: ['500mg', '1000mg'], basePrice: 210 },
    ]
  },
  {
    category: 'Vitamins, Minerals & Critical Hematinics',
    drugs: [
      { name: 'Ferrous Ascorbate + Folic Acid', dosages: ['100mg/1.5mg'], basePrice: 125 },
      { name: 'Ferric Carboxymaltose IV Infusion', dosages: ['500mg/10ml'], basePrice: 2400 },
      { name: 'Iron Sucrose Injection', dosages: ['100mg/5ml'], basePrice: 220 },
      { name: 'Methylcobalamin (Active B12)', dosages: ['500mcg', '1500mcg'], basePrice: 110 },
      { name: 'Vitamin B-Complex + Zinc Forte', dosages: ['Standard Cap'], basePrice: 48 },
      { name: 'Folic Acid', dosages: ['5mg'], basePrice: 25 },
      { name: 'Vitamin C (Ascorbic Acid) Chewable', dosages: ['500mg'], basePrice: 35 },
      { name: 'Vitamin E (Tocopheryl Acetate)', dosages: ['200mg', '400mg'], basePrice: 65 },
      { name: 'Zinc Sulfate Monohydrate', dosages: ['20mg', '50mg'], basePrice: 40 },
      { name: 'Coenzyme Q10', dosages: ['100mg', '300mg'], basePrice: 380 },
      { name: 'Omega-3 Fatty Acids (EPA/DHA)', dosages: ['1000mg'], basePrice: 220 },
      { name: 'Potassium Chloride PR', dosages: ['600mg'], basePrice: 95 },
      { name: 'Magnesium Oxide / Aspartate', dosages: ['400mg'], basePrice: 85 },
      { name: 'Oral Rehydration Salts (ORS WHO)', dosages: ['21.8g Sachet'], basePrice: 22 },
    ]
  },
  {
    category: 'Ophthalmology & ENT Care',
    drugs: [
      { name: 'Carboxymethylcellulose Eye Drops', dosages: ['0.5% 10ml', '1.0% 10ml'], basePrice: 140 },
      { name: 'Sodium Hyaluronate Eye Drops', dosages: ['0.1% 10ml'], basePrice: 220 },
      { name: 'Moxifloxacin Eye Drops', dosages: ['0.5% 5ml'], basePrice: 115 },
      { name: 'Tobramycin Eye Drops', dosages: ['0.3% 5ml'], basePrice: 95 },
      { name: 'Olopatadine Hcl Eye Drops', dosages: ['0.1% 5ml', '0.2% 5ml'], basePrice: 165 },
      { name: 'Timolol Maleate Eye Drops', dosages: ['0.25%', '0.5% 5ml'], basePrice: 85 },
      { name: 'Bimatoprost Eye Drops', dosages: ['0.03% 3ml'], basePrice: 480 },
      { name: 'Brimonidine Tartrate', dosages: ['0.15% 5ml'], basePrice: 310 },
      { name: 'Ciprofloxacin + Dexamethasone Ear Drops', dosages: ['10ml'], basePrice: 65 },
      { name: 'Paradichlorobenzene + Benzocaine Ear Drops', dosages: ['10ml Wax Softener'], basePrice: 75 },
      { name: 'Oxymetazoline Nasal Spray', dosages: ['0.05% 10ml'], basePrice: 85 },
      { name: 'Xylometazoline Nasal Drops', dosages: ['0.1% 10ml'], basePrice: 60 },
      { name: 'Fluticasone Furoate Nasal Spray', dosages: ['27.5mcg (120 sprays)'], basePrice: 380 },
      { name: 'Saline Isotonic Nasal Spray', dosages: ['50ml'], basePrice: 95 },
    ]
  },
  {
    category: 'Dermatology & Topical Formulations',
    drugs: [
      { name: 'Mupirocin Ointment', dosages: ['2% 5g', '2% 10g'], basePrice: 130 },
      { name: 'Fusidic Acid Cream', dosages: ['2% 10g'], basePrice: 110 },
      { name: 'Clindamycin Phosphate Gel', dosages: ['1% 20g'], basePrice: 145 },
      { name: 'Ketoconazole Cream & Lotion', dosages: ['2% 30g'], basePrice: 165 },
      { name: 'Luliconazole Cream', dosages: ['1% 10g', '1% 20g'], basePrice: 240 },
      { name: 'Permethrin Cream', dosages: ['5% 30g'], basePrice: 95 },
      { name: 'Hydrocortisone Butyrate Cream', dosages: ['0.1% 15g'], basePrice: 120 },
      { name: 'Betamethasone Dipropionate Cream', dosages: ['0.05% 20g'], basePrice: 75 },
      { name: 'Clobetasol Propionate Ointment', dosages: ['0.05% 20g'], basePrice: 135 },
      { name: 'Tacrolimus Ointment', dosages: ['0.03% 10g', '0.1% 10g'], basePrice: 340 },
      { name: 'Adapalene Gel', dosages: ['0.1% 15g'], basePrice: 185 },
      { name: 'Tretinoin Cream', dosages: ['0.025% 20g', '0.05% 20g'], basePrice: 195 },
      { name: 'Minoxidil Topical Solution', dosages: ['2% 60ml', '5% 60ml'], basePrice: 480 },
      { name: 'Silver Sulfadiazine Burn Cream', dosages: ['1% 50g'], basePrice: 90 },
      { name: 'Povidone-Iodine Ointment', dosages: ['5% 20g', '10% 100g'], basePrice: 65 },
      { name: 'Calamine + Zinc Oxide Lotion', dosages: ['100ml'], basePrice: 85 },
      { name: 'Urea + Lactic Acid Moisturizing Cream', dosages: ['100g'], basePrice: 175 },
    ]
  }
];

// Generate an enterprise catalog of 500+ realistic pharmaceutical SKUs
export const generateHospitalDrugInventory = (): Medication[] => {
  const inventory: Medication[] = [];
  let skuCounter = 1;

  for (const pharmaClass of PHARMA_CLASSES) {
    for (const drug of pharmaClass.drugs) {
      for (const dosage of drug.dosages) {
        // Derive packaging prefix
        let prefix = 'Tab.';
        if (dosage.includes('Inj') || drug.name.includes('Inj')) prefix = 'Inj.';
        else if (dosage.includes('ml') || dosage.includes('Susp') || dosage.includes('Syrup') || drug.name.includes('Syrup')) prefix = 'Syr.';
        else if (dosage.includes('Inhaler') || dosage.includes('MDI')) prefix = 'Inhaler';
        else if (dosage.includes('Drops')) prefix = 'Drops';
        else if (dosage.includes('Gel')) prefix = 'Gel';
        else if (dosage.includes('Cream') || dosage.includes('Ointment')) prefix = 'Oint.';
        else if (dosage.includes('Cap') || drug.name.includes('Cap')) prefix = 'Cap.';
        else if (dosage.includes('Sachet')) prefix = 'Sachet';

        // Pseudo-random stock and price scaling
        const randomStock = Math.floor(60 + ((skuCounter * 17) % 750));
        const priceVariance = Math.floor((skuCounter * 7) % 25);
        const finalPrice = Math.max(15, drug.basePrice + priceVariance);

        inventory.push({
          id: `MED-IN-${String(skuCounter).padStart(4, '0')}`,
          name: `${prefix} ${drug.name}`,
          dosage,
          category: pharmaClass.category,
          stock: randomStock,
          priceINR: finalPrice,
        });

        skuCounter++;
      }
    }
  }

  return inventory;
};
