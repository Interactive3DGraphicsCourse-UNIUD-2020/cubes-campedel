/**
 * @name generateTree
 * @description Funzione che genera un albero
 * @param {THREE.Object3D} container
 * @param {number} treeHeight
 * @param {number} treeWidth
 * @param {boolean} wireframe
 */

function generateTree(container, treeHeight = 5, treeWidth = 2, wireframe = false) {
	// container indica l'Object3D dove inserire i cubi
	// treeHeight rappresenta l'altezza complessiva dell'albero
	// treeWidth rappresenta la larghezza massima dell'albero
	// wireframe indica se il cubo generato è o meno in wireframe

	// baseProportion rappresenta la proporzione della base rispetto all'altezza complessiva dell'albero, calcolata da esempi di alberi reali
	let baseProportion = 0.15;
	
	// impostazione della larghezza come dispari (se pari viene addizionata di 1)
	treeWidth = treeWidth % 2 == 1 ? treeWidth : treeWidth + 1;
	
	// creazione di un cubo di lato 1
	let geometry = new THREE.BoxGeometry(1, 1, 1);

	// creazione del materiale legno, un cubo marrone
	let materialWood = new THREE.MeshBasicMaterial({ color: 0xC26D3F, wireframe: wireframe });
	
	// calcolo dell'altezza della base, in ogni caso mai minore di 1
	let baseHeight = Math.floor(treeHeight * baseProportion);
	baseHeight = baseHeight != 0 ? baseHeight : 1;
	// creazione della variabile lastBaseCubeAdded che salva l'ultimo cubo della base aggiunto alla scena, in modo da sapere da che y iniziare per costruire le foglie
	let lastBaseCubeAdded;
	// creazione della variabile per la mesh del legno
	let meshWood;
	// inizializzazione del ciclo che costruisce la base
	for (lastBaseCubeAdded = 0; lastBaseCubeAdded < baseHeight; lastBaseCubeAdded++) {
		// inserimento di un cubo nel vettore wood
		meshWood = new THREE.Mesh(geometry, materialWood);
		// impostazione della posizione del cubo inserito nel vettore (la posizione y calcolata deve essere addizionata di 0.5 + 1.0 dal momento che rappresenta la posizione del centro di un cubo di dimensione 1, per cui per avere la base che appoggia sul piano y = 1 (quello dell'erba) è necessario effettuare un offset verticale)
		meshWood.position.y = lastBaseCubeAdded + 0.5;
		// aggiunta del cubo alla scena
		container.add(meshWood);
	}

	// creazione del materiale foglie, un cubo verde
	let materialLeaf = new THREE.MeshBasicMaterial({ color: 0x528919, wireframe: wireframe  });
	/** 
	 * istanziazione di variabili
	 * - leafsNaiveDimension
	 * - leafsDimension
	 * - creazione e calcolo della variabile maxNaiveWidth, ovvero il lato del piano di foglie più basso, il più grande. L'idea di base era quella di generare le foglie in modo che il livello più alto avesse un solo cubo, mentre per i livelli più bassi si dovevano aggiungere due cubi ogni volta che si scendeva. In questo modo livello più alto avrebbe avuto un cubo di lato, il secondo più alto tre, il terzo cinque e avanti così.
	 *   Questa soluzione portava però ad avere un albero completamente sproporzionato rispetto ad un albero vero, quindi in seguito verrà inserita una mappatura del range originale di dimensioni in uno minore, determinato dalla variabile treeWidth.
	 * - startingCoordinate
	 */
	let leafsNaiveDimension,
		leafsDimension,
		maxNaiveWidth = ((treeHeight - lastBaseCubeAdded) * 2 - 1),
		startingCoordinate,
		meshLeafs;
	// inizializzazione del ciclo che gestisce la variabile che rappresenta y, quindi a che livello di foglie ci si trova, dal livello più basso al livello più alto
	for (let y = lastBaseCubeAdded; y < treeHeight; y++) {
		// calcolo di leafsNaiveDimension nel livello attuale, la dimensione del livello di foglie calcolata nel metodo naive descritto sopra
		leafsNaiveDimension = ((treeHeight - y) * 2 - 1);
		// la soluzione naive soluzione portava ad avere un albero completamente sproporzionato rispetto ad un albero vero, quindi viene usato il parametro maxWidth per specificare la massima dimensione del livello più basso di foglie e il range di dimensioni precedente viene rimappato nel nuovo in modo che il massimo sia quello specificato, salvando il tutto in leafsDimension
		leafsDimension = 1 + ((leafsNaiveDimension - 1)*(treeWidth - 1))/(maxNaiveWidth - 1);
		// calcolo della coordinata x per il posizionamento dei cubi
		startingCoordinate = Math.floor(leafsDimension / 2);
		// inizializzazione del ciclo che gestisce la posizione del cubo in x
		for (let x = -startingCoordinate; x <= startingCoordinate; x++)
			// inizializzazione del ciclo che gestisce la posizione del cubo in z
			for (let z = -startingCoordinate; z <= startingCoordinate; z++) {
				// aggiunta del cubo al vettore leafs
				meshLeafs = new THREE.Mesh(geometry, materialLeaf);
				// impostazione della posizione del cubo appena inserito nel vettore
				meshLeafs.position.set(x, y + 0.5, z);
				// aggiunta del cubo nel vettore
				container.add(meshLeafs);
			}
	}
}