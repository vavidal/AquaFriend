import { Component, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

type Categoria = 'Animales' | 'Aves' | 'Peces' | 'Reptiles';

interface FichaFauna {
categoria: Categoria;
nombre: string;
cientifico?: string;
descripcion: string;
habitat: string;
alimentacion: string;
reproduccion?: string;
imagen?: string;
}

@Component({
selector: 'app-catalogo',
standalone: true,
imports: [NgFor, NgIf],
templateUrl: './catalogo.html',
styleUrls: ['./catalogo.scss']
})
export class CatalogoComponent {
readonly categorias: Categoria[] = ['Animales', 'Aves', 'Peces', 'Reptiles'];
readonly defaultSrc = 'assets/img/granja/default.jpg';

readonly fichas: FichaFauna[] = [
{
categoria: 'Animales',
nombre: 'Conejo Cabeza de León',
cientifico: 'Oryctolagus cuniculus',
descripcion: 'Especie exótica doméstica, originaria de Bélgica.',
habitat: 'Áreas secas cercanas al nivel del mar con suelo arenoso para madrigueras.',
alimentacion: 'Granos, frutas, verduras y pellet de alfalfa.',
imagen: 'assets/img/granja/conejo_cabeza_leon.jpg'
},
{
categoria: 'Animales',
nombre: 'Vaquilla (Ganado Jersey)',
cientifico: 'Bos taurus',
descripcion: 'Raza lechera de alta producción y docilidad.',
habitat: 'Praderas de la zona sur de Chile.',
alimentacion: 'Pastos y forrajes.',
reproduccion: 'Gestación ~283 días; vida 15–20 años.',
imagen: 'assets/img/granja/vaquilla.jpg'
},
{
categoria: 'Animales',
nombre: 'Ovejas',
cientifico: 'Ovis aries',
descripcion: 'Rumiantes domesticados desde hace ~9000 años.',
habitat: 'Climas templados, praderas y montañas.',
alimentacion: 'Herbívoras.',
reproduccion: 'Gestación ~5 meses; vida 6–10 años.',
imagen: 'assets/img/granja/oveja.jpg'
},
{
categoria: 'Animales',
nombre: 'Cabras',
cientifico: 'Capra aegagrus hircus',
descripcion: 'Domesticadas por carne y leche; muy adaptables.',
habitat: 'Zonas con pendiente y suelos pobres.',
alimentacion: 'Herbívoras; también malezas y zarzas.',
reproduccion: 'Gestación ~150 días; vida 15–18 años.',
imagen: 'assets/img/granja/cabra.png'
},
{
categoria: 'Aves',
nombre: 'Faisán',
cientifico: 'Phasianus colchicus',
descripcion: 'Originario del sur de Asia; plumaje vistoso.',
habitat: 'Domesticado; presente en Chile centro-sur.',
alimentacion: 'Granos, frutas, semillas y pasto.',
reproduccion: 'Ovípara; incubación ~21 días.',
imagen: 'assets/img/granja/faisan.jpg'
},
{
categoria: 'Aves',
nombre: 'Gallina Trintre (Plumas al revés)',
cientifico: 'Gallus gallus domesticus',
descripcion: 'Criada por pueblos mapuche; doble propósito.',
habitat: 'Ave domesticada en Chile.',
alimentacion: 'Granos, frutas, semillas y hierbas.',
reproduccion: 'Ovípara; incubación ~21 días; vida 5–10 años.',
imagen: 'assets/img/granja/gallina_trintre.jpg'
},
{
categoria: 'Aves',
nombre: 'Gallina Brahma',
cientifico: 'Gallus gallus domesticus',
descripcion: 'Raza asiática, de las más grandes; rústica.',
habitat: 'Ave domesticada.',
alimentacion: 'Granos, frutas, semillas y hierbas.',
reproduccion: 'Ovípara; incubación ~21 días; vida 5–10 años.',
imagen: 'assets/img/granja/gallina_brahma.webp'
},
{
categoria: 'Aves',
nombre: 'Gallina Ponedora',
cientifico: 'Gallus gallus domesticus',
descripcion: 'Alta producción de huevos.',
habitat: 'Principalmente zona centro-sur; avícolas.',
alimentacion: 'Granos, frutas, semillas y pasto.',
reproduccion: 'Ovípara; incubación ~21 días; vida 2–5 años.',
imagen: 'assets/img/granja/gallina_ponedora.jpg'
},
{
categoria: 'Aves',
nombre: 'Gallina Collonca Enana (Conchinchina)',
cientifico: 'Gallus inauris castelloi',
descripcion: 'Raza mapuche sin cola.',
habitat: 'Ave domesticada.',
alimentacion: 'Granos, frutas, semillas y hierbas.',
reproduccion: 'Ovípara; incubación ~21 días; vida 5–10 años.',
imagen: 'assets/img/granja/gallina_collonca_enana.jpg'
},
{
categoria: 'Aves',
nombre: 'Gallina Sedosa (Silkie)',
cientifico: 'Gallus gallus',
descripcion: 'Plumaje sedoso; dócil.',
habitat: 'Ave domesticada.',
alimentacion: 'Invertebrados, semillas y vegetales.',
reproduccion: 'Pone 9–15 huevos; incubación 19–21 días; vida 9–15 años.',
imagen: 'assets/img/granja/gallina_sedosa.webp'
},
{
categoria: 'Aves',
nombre: 'Gallina de la Pasión (Kikirikí)',
cientifico: 'Gallus gallus domesticus',
descripcion: 'Ave de pequeño tamaño, típica de Chile.',
habitat: 'Ave domesticada.',
alimentacion: 'Granos, frutas, semillas y hierbas.',
reproduccion: 'Ovípara; incubación ~21 días; vida 5–10 años.',
imagen: 'assets/img/granja/gallina_pasion.jpeg'
},
{
categoria: 'Aves',
nombre: 'Gallina Polaca',
cientifico: 'Gallus gallus domesticus',
descripcion: 'Cresta de plumas muy característica.',
habitat: 'Ave domesticada.',
alimentacion: 'Granos, frutas, semillas, hierbas e invertebrados.',
reproduccion: 'Ovípara; incubación ~21 días.',
imagen: 'assets/img/granja/gallina_polaca.jpg'
},
{
categoria: 'Aves',
nombre: 'Ganso Común',
cientifico: 'Anser anser',
descripcion: 'Doméstico asilvestrado en diversas regiones.',
habitat: 'Lagos y zonas húmedas cercanas a agua.',
alimentacion: 'Pastoreo de hierbas y brotes; plantas flotantes.',
reproduccion: 'Ovípara; incubación ~27–29 días; vida 2–5 años.',
imagen: 'assets/img/granja/ganso.jpg'
},
{
categoria: 'Aves',
nombre: 'Ganso Chino',
cientifico: 'Anser cygnoides',
descripcion: 'Descendiente de gansos silvestres; también llamado Ganso Cisne.',
habitat: 'Cercanías de lagunas y lagos.',
alimentacion: 'Granos, frutas, semillas y pasto.',
reproduccion: 'Ovípara; incubación ~29–30 días; vida ~20 años.',
imagen: 'assets/img/granja/ganso_chino.png'
},
{
categoria: 'Aves',
nombre: 'Pato Doméstico',
cientifico: 'Anas platyrhynchos domesticus',
descripcion: 'Domesticados; comunes en cuerpos de agua.',
habitat: 'Lagunas, lagos, esteros; zonas domesticadas.',
alimentacion: 'Granos, frutas, semillas, hierbas y algas.',
reproduccion: 'Ovípara; incubación ~27–30 días.',
imagen: 'assets/img/granja/Pato_domestico.jpg'
},
{
categoria: 'Aves',
nombre: 'Pato Jergón',
cientifico: 'Anas georgica / Anas flavirostris',
descripcion: 'Especies nativas conocidas en Chile.',
habitat: 'Lagunas, lagos, esteros y costas protegidas.',
alimentacion: 'Granos, frutas, semillas, hierbas y algas.',
reproduccion: 'Ovípara; incubación ~29–30 días.',
imagen: 'assets/img/granja/pato_jergon.jpg'
},
{
categoria: 'Aves',
nombre: 'Pato Silvestre o de Collar',
cientifico: 'Anas platyrhynchos',
descripcion: 'Macho con collar blanco y cabeza verde metálica.',
habitat: 'Lagunas, lagos y charcos.',
alimentacion: 'Granos, frutas, semillas, hierbas y algas.',
reproduccion: 'Ovípara; incubación ~29–30 días; vida 9–15 años.',
imagen: 'assets/img/granja/pato_silvestre_o_collar.jpg'
},
{
categoria: 'Aves',
nombre: 'Pato Carolina (Joyuyo)',
cientifico: 'Aix sponsa',
descripcion: 'Macho de plumaje brillante; hembra parda.',
habitat: 'Lagunas, lagos y pantanos.',
alimentacion: 'Granos, frutas, semillas, hierbas y algas.',
reproduccion: 'Ovípara; incubación ~28–32 días; vida 9–12 años.',
imagen: 'assets/img/granja/pato_carolina.jpeg'
},
{
categoria: 'Aves',
nombre: 'Pato Pingüino (Corredor indio)',
cientifico: 'Anas platyrhynchos domesticus',
descripcion: 'Porte vertical característico; doméstico.',
habitat: 'Lagunas, lagos y esteros.',
alimentacion: 'Granos, frutas, semillas, hierbas y algas.',
reproduccion: 'Ovípara; incubación ~28 días; vida 5–10 años.',
imagen: 'assets/img/granja/pato_pinguino.jpg'
},
{
categoria: 'Aves',
nombre: 'Pato Negro (Rey/Picazo)',
cientifico: 'Netta peposaca',
descripcion: 'Plumaje negro con marcas blancas; macho con bulto en el pico.',
habitat: 'Humedales de agua dulce y salobre con vegetación.',
alimentacion: 'Omnívora con plantas acuáticas, frutos e invertebrados.',
reproduccion: 'Ovípara; incubación ~29–30 días.',
imagen: 'assets/img/granja/pato_negro.jpg'
},
{
categoria: 'Peces',
nombre: 'Pez Dorado (Goldfish)',
cientifico: 'Carassius auratus',
descripcion: 'Pez de agua dulce muy común en acuarios educativos y domésticos.',
habitat: 'Aguas dulces tranquilas: estanques y acuarios amplios de baja corriente.',
alimentacion: 'Omnívoro; consume escamas comerciales, pellets y vegetales blandos.',
reproduccion: 'Ovípara; desova sobre plantas acuáticas; vida 10–15 años en buenas condiciones.',
imagen: 'assets/img/granja/pez_dorado.jpg'
},
{
categoria: 'Peces',
nombre: 'Carpa Koi',
cientifico: 'Cyprinus rubrofuscus',
descripcion: 'Variedad ornamental de carpa muy utilizada en estanques y acuarios grandes.',
habitat: 'Aguas dulces de movimiento lento: lagunas, estanques y canales.',
alimentacion: 'Omnívora; pellets flotantes, vegetales y pequeños invertebrados.',
reproduccion: 'Ovípara; desova en vegetación sumergida; vida 20–30 años.',
imagen: 'assets/img/granja/carpa_koi.jpg'
},
{
categoria: 'Peces',
nombre: 'Guppy',
cientifico: 'Poecilia reticulata',
descripcion: 'Pez pequeño y muy colorido, ideal para acuarios escolares.',
habitat: 'Aguas dulces templadas de ríos y lagunas de corriente suave.',
alimentacion: 'Omnívoro; escamas, microinvertebrados y algas.',
reproduccion: 'Ovovivíparo; las crías nacen completamente formadas.',
imagen: 'assets/img/granja/guppy.png'
},
{
categoria: 'Peces',
nombre: 'Molly',
cientifico: 'Poecilia sphenops',
descripcion: 'Pez resistente y sociable, muy usado en acuarios comunitarios.',
habitat: 'Aguas dulces o ligeramente salobres de baja corriente.',
alimentacion: 'Omnívoro con preferencia por algas y vegetales.',
reproduccion: 'Ovovivíparo; pariciones frecuentes de varias crías.',
imagen: 'assets/img/granja/pez-molly.webp'
},

{
categoria: 'Peces',
nombre: 'Corydora',
cientifico: 'Corydoras paleatus',
descripcion: 'Pez de fondo que ayuda a limpiar restos de alimento en acuarios.',
habitat: 'Aguas dulces de ríos y arroyos con fondos arenosos o de grava fina.',
alimentacion: 'Omnívoro; tabletas de fondo, restos de comida y pequeños invertebrados.',
reproduccion: 'Ovípara; adhiere los huevos en hojas, troncos o superficies lisas.',
imagen: 'assets/img/granja/corydora.jpg'
},
{
categoria: 'Peces',
nombre: 'Trucha Arcoíris Juvenil',
cientifico: 'Oncorhynchus mykiss',
descripcion: 'Etapa juvenil de una especie de salmónido utilizada con fines educativos.',
habitat: 'Ríos y lagos de agua fría, bien oxigenada.',
alimentacion: 'Carnívora; en acuarios se alimenta con pellet específico para salmonídeos.',
reproduccion: 'Ovípara; desova en lechos de grava en cursos de agua fría.',
imagen: 'assets/img/granja/trucha_arcoiris.jpg'
},
{
categoria: 'Reptiles',
nombre: 'Tortuga de Orejas Rojas',
cientifico: 'Trachemys scripta',
descripcion: 'Semiacuática e invasora; prohibida en Chile en medio natural.',
habitat: 'Lagos, ríos y arroyos.',
alimentacion: 'Omnívora.',
reproduccion: 'Postura ~2 meses; eclosión 80–85 días; vida 15–30 años.',
imagen: 'assets/img/granja/Tortuga_orejas_rojas.png'
}
];

abierto = signal<Record<Categoria, boolean>>({
Animales: true,
Aves: true,
Peces: true,
Reptiles: true
});

toggle(cat: Categoria): void {
this.abierto.update(state => ({ ...state, [cat]: !state[cat] }));
}

porCategoria(cat: Categoria): FichaFauna[] {
return this.fichas.filter(f => f.categoria === cat);
}

imgDe(f: FichaFauna): string {
return f.imagen ?? this.defaultSrc;
}

onImgError(ev: Event): void {
(ev.target as HTMLImageElement).src = this.defaultSrc;
}

onLogoError(ev: Event): void {
(ev.target as HTMLImageElement).style.display = 'none';
}
}
