
export const translations = {
  en: {
    // Tabs
    fuelEntry: 'Add Fuel',
    statistics: 'Statistics',
    settings: 'Settings',
    
    // Fuel Entry Screen
    addFuelEntry: 'Add Fuel Entry',
    date: 'Date',
    cost: 'Cost',
    amount: 'Amount',
    odometer: 'Odometer (optional)',
    notes: 'Notes (optional)',
    save: 'Save Entry',
    cancel: 'Cancel',
    
    // Statistics Screen
    monthlyStats: 'Monthly Statistics',
    yearlyStats: 'Yearly Statistics',
    totalCost: 'Total Cost',
    totalAmount: 'Total Amount',
    averagePrice: 'Average Price',
    entries: 'Entries',
    noData: 'No fuel entries yet',
    addFirstEntry: 'Add your first fuel entry to see statistics',
    
    // Settings Screen
    language: 'Language',
    currency: 'Currency',
    unit: 'Unit',
    liters: 'Liters',
    gallons: 'Gallons',
    
    // Messages
    entrySaved: 'Fuel entry saved successfully',
    entryDeleted: 'Fuel entry deleted',
    error: 'An error occurred',
    fillAllFields: 'Please fill in all required fields',
    invalidAmount: 'Please enter valid amounts',
  },
  es: {
    // Tabs
    fuelEntry: 'Añadir Combustible',
    statistics: 'Estadísticas',
    settings: 'Configuración',
    
    // Fuel Entry Screen
    addFuelEntry: 'Añadir Entrada de Combustible',
    date: 'Fecha',
    cost: 'Costo',
    amount: 'Cantidad',
    odometer: 'Odómetro (opcional)',
    notes: 'Notas (opcional)',
    save: 'Guardar Entrada',
    cancel: 'Cancelar',
    
    // Statistics Screen
    monthlyStats: 'Estadísticas Mensuales',
    yearlyStats: 'Estadísticas Anuales',
    totalCost: 'Costo Total',
    totalAmount: 'Cantidad Total',
    averagePrice: 'Precio Promedio',
    entries: 'Entradas',
    noData: 'No hay entradas de combustible',
    addFirstEntry: 'Añade tu primera entrada para ver estadísticas',
    
    // Settings Screen
    language: 'Idioma',
    currency: 'Moneda',
    unit: 'Unidad',
    liters: 'Litros',
    gallons: 'Galones',
    
    // Messages
    entrySaved: 'Entrada guardada exitosamente',
    entryDeleted: 'Entrada eliminada',
    error: 'Ocurrió un error',
    fillAllFields: 'Por favor complete todos los campos requeridos',
    invalidAmount: 'Por favor ingrese cantidades válidas',
  },
  fr: {
    // Tabs
    fuelEntry: 'Ajouter Carburant',
    statistics: 'Statistiques',
    settings: 'Paramètres',
    
    // Fuel Entry Screen
    addFuelEntry: 'Ajouter une Entrée de Carburant',
    date: 'Date',
    cost: 'Coût',
    amount: 'Quantité',
    odometer: 'Odomètre (optionnel)',
    notes: 'Notes (optionnel)',
    save: 'Enregistrer',
    cancel: 'Annuler',
    
    // Statistics Screen
    monthlyStats: 'Statistiques Mensuelles',
    yearlyStats: 'Statistiques Annuelles',
    totalCost: 'Coût Total',
    totalAmount: 'Quantité Totale',
    averagePrice: 'Prix Moyen',
    entries: 'Entrées',
    noData: 'Aucune entrée de carburant',
    addFirstEntry: 'Ajoutez votre première entrée pour voir les statistiques',
    
    // Settings Screen
    language: 'Langue',
    currency: 'Devise',
    unit: 'Unité',
    liters: 'Litres',
    gallons: 'Gallons',
    
    // Messages
    entrySaved: 'Entrée enregistrée avec succès',
    entryDeleted: 'Entrée supprimée',
    error: 'Une erreur est survenue',
    fillAllFields: 'Veuillez remplir tous les champs requis',
    invalidAmount: 'Veuillez entrer des montants valides',
  },
  de: {
    // Tabs
    fuelEntry: 'Kraftstoff Hinzufügen',
    statistics: 'Statistiken',
    settings: 'Einstellungen',
    
    // Fuel Entry Screen
    addFuelEntry: 'Kraftstoffeintrag Hinzufügen',
    date: 'Datum',
    cost: 'Kosten',
    amount: 'Menge',
    odometer: 'Kilometerzähler (optional)',
    notes: 'Notizen (optional)',
    save: 'Eintrag Speichern',
    cancel: 'Abbrechen',
    
    // Statistics Screen
    monthlyStats: 'Monatsstatistiken',
    yearlyStats: 'Jahresstatistiken',
    totalCost: 'Gesamtkosten',
    totalAmount: 'Gesamtmenge',
    averagePrice: 'Durchschnittspreis',
    entries: 'Einträge',
    noData: 'Noch keine Kraftstoffeinträge',
    addFirstEntry: 'Fügen Sie Ihren ersten Eintrag hinzu, um Statistiken zu sehen',
    
    // Settings Screen
    language: 'Sprache',
    currency: 'Währung',
    unit: 'Einheit',
    liters: 'Liter',
    gallons: 'Gallonen',
    
    // Messages
    entrySaved: 'Eintrag erfolgreich gespeichert',
    entryDeleted: 'Eintrag gelöscht',
    error: 'Ein Fehler ist aufgetreten',
    fillAllFields: 'Bitte füllen Sie alle erforderlichen Felder aus',
    invalidAmount: 'Bitte geben Sie gültige Beträge ein',
  },
};

export const getTranslation = (language: 'en' | 'es' | 'fr' | 'de', key: string): string => {
  return translations[language][key as keyof typeof translations.en] || key;
};
