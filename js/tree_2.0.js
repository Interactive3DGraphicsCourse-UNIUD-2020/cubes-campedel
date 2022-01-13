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
	let materialWood = new THREE.MeshStandardMaterial({ color: 0xC26D3F, wireframe: wireframe });

	// calcolo dell'altezza della base, in ogni caso mai minore di 1
	let baseHeight = Math.floor(treeHeight * baseProportion);
	baseHeight = baseHeight != 0 ? baseHeight : 1;
	// creazione della variabile lastBaseCubeAdded che salva l'ultimo cubo della base aggiunto alla scena, in modo da sapere da che y iniziare per costruire le foglie
	let lastBaseCubeAdded;
	// creazione della variabile per la mesh del legno
	let meshWood;
	// inizializzazione del ciclo che costruisce la base
	let nCubesWood = 0;
	for (lastBaseCubeAdded = 0; lastBaseCubeAdded < baseHeight; lastBaseCubeAdded++) {
		// inserimento di un cubo nel vettore wood
		meshWood = new THREE.Mesh(geometry, materialWood);
		meshWood.castShadow = true;
		meshWood.receiveShadow = true;
		// impostazione della posizione del cubo inserito nel vettore (la posizione calcolata deve essere addizionata di 0.5 dal momento che rappresenta la posizione del centro di un cubo di dimensione 1)
		meshWood.position.set(0.5, lastBaseCubeAdded + 0.5, 0.5);
		// aggiunta del cubo alla scena
		container.add(meshWood);
		nCubesWood++;
	}

	// creazione del materiale foglie, un cubo verde
	let materialLeaf = new THREE.MeshLambertMaterial({ color: 0x528919, wireframe: wireframe });
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
	// inizializzazione del ciclo che gestisce la variabile che rappresenta y, quindi il livello di foglie in cui ci si trova, dal livello più basso al livello più alto
	for (let y = lastBaseCubeAdded; y < treeHeight; y++) {
		// calcolo di leafsNaiveDimension nel livello attuale, la dimensione del livello di foglie calcolata nel metodo naive descritto sopra
		leafsNaiveDimension = ((treeHeight - y) * 2 - 1);
		// la soluzione naive portava ad avere un albero completamente sproporzionato rispetto ad un albero vero, quindi viene usato il parametro maxWidth per specificare la massima dimensione del livello più basso di foglie e il range di dimensioni precedente viene rimappato nel nuovo in modo che il massimo sia quello specificato, salvando il tutto in leafsDimension
		leafsDimension = 1 + ((leafsNaiveDimension - 1) * (treeWidth - 1)) / (maxNaiveWidth - 1);
		// calcolo della coordinata x per il posizionamento dei cubi
		startingCoordinate = Math.floor(leafsDimension / 2);

		// per non creare anche i cubi interni all'albero, che non sarebbero visibili, si considera per prima cosa il livello più basso di foglie, che deve essere composto da un quadrato di cubi di lato leafsDimension
		if (y == lastBaseCubeAdded) {
			// inizializzazione del ciclo che gestisce la posizione del cubo in z
			for (let z = -startingCoordinate; z <= startingCoordinate; z++)
				// inizializzazione del ciclo che gestisce la posizione del cubo in x
				for (let x = -startingCoordinate; x <= startingCoordinate; x++) {
					// creazione della Mesh del cubo
					meshLeafs = new THREE.Mesh(geometry, materialLeaf);
					meshLeafs.castShadow = true;
					meshLeafs.receiveShadow = true;
					// impostazione della posizione del cubo appena inserito nel vettore; anche in questo caso vale il discorso dell'offset di 0.5 dal momento che il cubo ha lato 1
					meshLeafs.position.set(x + 0.5, y + 0.5, z + 0.5);
					// aggiunta del cubo al container
					container.add(meshLeafs);
				}
		// nei livelli successivi al più basso invece è necessario creare solamente i cubi esterni, ovvero quelli visibili nel render real-time finale. Per fare questo, quando z è al suo valore massimo e minimo secondo la dimensione dell'albero, è necessario creare un cubo per ogni x nel suo range, mentre quando z è nei valori intermedi tra il massimo e il minimo è necessario creare solamente i cubi corrispondenti al massimo e al minimo di x
		} else {
			// inizializzazione del ciclo che gestisce la posizione del cubo in z
			for (let z = -startingCoordinate; z <= startingCoordinate; z++)
				// nel caso in cui z sia al suo massimo o minimo si crea un cubo in ogni coordinata nel range di x
				if (z == -startingCoordinate || z == startingCoordinate)
					for (let x = -startingCoordinate; x <= startingCoordinate; x++) {
						meshLeafs = new THREE.Mesh(geometry, materialLeaf);
						meshLeafs.castShadow = true;
						meshLeafs.receiveShadow = true;
						meshLeafs.position.set(x + 0.5, y + 0.5, z + 0.5);
						container.add(meshLeafs);
					}
				// nel caso in cui z non sia al suo massimo o minimo è necessario creare solamente due cubi, uno per il massimo e uno per il minimo di x
				else {
					meshLeafs = new THREE.Mesh(geometry, materialLeaf);
					meshLeafs.castShadow = true;
					meshLeafs.receiveShadow = true;
					meshLeafs.position.set(-startingCoordinate + 0.5, y + 0.5, z + 0.5);
					container.add(meshLeafs);

					meshLeafs = new THREE.Mesh(geometry, materialLeaf);
					meshLeafs.castShadow = true;
					meshLeafs.receiveShadow = true;
					meshLeafs.position.set(startingCoordinate + 0.5, y + 0.5, z + 0.5);
					container.add(meshLeafs);
				}
		}
	}
}