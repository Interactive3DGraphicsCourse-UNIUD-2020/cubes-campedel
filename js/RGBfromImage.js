/**
 * @name getHeightData
 * @description Funzione che converte un'immagine in un vettore di valori RGB salvati in vettori di tre elementi
 * @param {object} img
 * @param {function(data)} callback
 * @returns 
 */

function getRGBfromImage(imgURI, callback) {
	// istanziazione dell'oggetto Image di JavaScript
	var img = new Image();
	// impostazione dell'URI dell'immagine come fonte
	img.src = imgURI;
	// esecuzione della funzione al caricamento dell'immagine
	return img.onload = function () {
		// creazione del canvas nel quale verrà inserita l'immagine per la lettura dei valori RGB dei singoli pixel
		let canvas = document.createElement('canvas');
		// impostazione delle dimensioni del canvas uguali a quelle dell'immagine
		canvas.width = img.width;
		canvas.height = img.height;
		// ottenimento del contesto 2D del canvas per disegnare un'immagine 2D
		let context = canvas.getContext('2d');

		// disegno dell'immagine nel canvas a partire dalla posizione 0, 0
		context.drawImage(img, 0, 0);

		// ottenimento dei dati dell'immagine nel contesto 2D del canvas
		let imgd = context.getImageData(0, 0, img.width, img.height);
		// ottentimento della lista di valori R, G, B e A dei pixel
		let pix = imgd.data;

		// inizializzazione del vettore che conterrà i valori RGB
		let data = [];
		// inizializzazione del ciclo che scorrerà la lista dei valori R, G, B e A dei pixel, quattro elementi alla volta
		for (let i = 0; i < pix.length; i += 4)
			// salvataggio della tripla RGB per il pixel considerato nel vettore data
			data.push([pix[i], pix[i + 1], pix[i + 2]]);

		// restituzione dei dati in modo asincrono
		callback(data);
	};
}