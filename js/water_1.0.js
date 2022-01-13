/**
 * @name generateWater
 * @description Funzione che genera un cubo di erba
 * @param {Array} coordinates
 * @param {boolean} wireframe
 */

 function generateWater(container, coordinates, wireframe = false) {
	// container indica l'Object3D dove inserire i cubi
	// coordinates rappresenta un array di triple contenenti le coordinate x, y e z del centro del cubo; ogni tripla rappresenta un cubo diverso
	// wireframe indica se il cubo generato è o meno in wireframe

	// creazione di un cubo di lato 1
	let geometry = new THREE.BoxGeometry(1, 1, 1);

	// creazione del materiale erba, un cubo azzurro chiaro semitrasparente
	let materialWater = new THREE.MeshStandardMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.5, wireframe: wireframe });

	// istanziazione della varibile che conterrà la mesh
	let mesh;
	// ciclo su ogni coordinata
	coordinates.forEach(coordinate => {
		// salvataggio della mesh appena creata nell'apposita variabile
		mesh = new THREE.Mesh(geometry, materialGrass);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		// impostazione della posizione del cubo (la posizione y calcolata deve essere addizionata di 0.5 dal momento che rappresenta la posizione del centro di un cubo di dimensione 1, per cui per avere la base che appoggia sul piano y = 0 è necessario effettuare un offset verticale)
		mesh.position.set(Math.ceil(coordinate[0]) + 0.5, Math.ceil(coordinate[1]) + 0.5, Math.ceil(coordinate[2]) + 0.5);
		container.add(mesh);
	});
}