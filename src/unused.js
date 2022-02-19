


// Limittable (Grenzwert)

document.getElementById("limitbase").addEventListener("change", limitCalc);
document.getElementById("limitarc").addEventListener("change", limitCalc);

function limitCalc() {
    let limitBase = $('#limitbase').val();
    localStorage.setItem("limitbase", limitBase);


    let limitArc = $('#limitarc').val();
    localStorage.setItem("limitarc", limitArc);
    if (limitArc < 81) { return; }
    // Errechne aus Stufe der Arche deren Bonus (ab Stufe 80)
    let limitArcBase = 1.9 + (0.001 * (limitArc - 80));

    let limitresults = [];

    let FPValue = 1;
    let iterations = 0;
    let successCount = 0;
    while (iterations <= 7) {
        // Berechne den Bonus mit Basiswert (limitBase) und höherer Arche (limitArcBase)
        let FPBase = Math.round(FPValue * limitBase);
        let FPArc = Math.round(FPValue * limitArcBase);

        // Falls die höhere Arche mehr FP generiert (limitresults.length um nach 1, 2, 3... zu suchen)
        if (FPArc > (FPBase + limitresults.length)) {
            successCount++;

            // Suche 10 Fälle in Folge bei denen FPArc höher ist (um Ausreisser durch Rundung zu eliminieren)
            if (successCount > 10) {

                // Füge Ergebnis der Liste hinzu. Ab erstem Ergebnis wird konstant 1 FP mehr erzeugt, ab 2. 2 etc.
                limitresults.push(FPValue - 10);
                iterations++;

                // Füge Ergbebnisse in Tabelle ein
                $('#limitvalue' + iterations).text(FPValue - 10);
                $('#limitvaluebase' + iterations).text(FPBase - 10);
                $('#limitvaluearc' + iterations).text(FPArc - 10);

            }
        } else {
            // Ist einmalig der FPArc Wert nicht grösser. Suchen wir weiter
            successCount = 0
        }

        // Die FP Menge wird in diesem Prozess langsam erhöht
        FPValue++;

    }

    $('#limitvaluebase').text(limitBase);
    $('#limitvaluearc').text(limitArcBase.toFixed(3));

}