'use strict';

const { urlencoded, response } = require('express');
const express = require('express');
const wiki = require('wikijs').default;
const { Client } = require('pg')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const clientConn = {
  user: 'petal_admin',
  host: 'localhost',
  database: 'petal',
  password: 'mysecretpassword',
  port: 5432,
}

// If you want to run the API without the database for development, set stub to true.
const stub = false;
const stubLabels = [
  { label: 'Reduce drag', id: 1 },
  { label: 'Absorb shock', id: 2 },
  { label: 'Dissipate heat', id: 3 },
  { label: 'Increase lift', id: 4 },
  { label: 'Remove particles from a surface', id: 5 }
];
const stubArticles = [{"id":7681471,"url":"https://en.wikipedia.org/wiki/Aimophila","title":"Aimophila","image":"https://upload.wikimedia.org/wikipedia/commons/c/c3/Rufous_Crowned_Sparrow_A.r._eremoeca_Texas.jpg","summary":"Aimophila is a genus of American sparrows. The derivation of the genus name is from aimos/αιμος \"thicket\" and phila/φιλα \"loving\".Some species that were formerly classified in Aimophila are now considered to be in the genus Peucaea."},{"id":10692973,"url":"https://en.wikipedia.org/wiki/American_sparrow","title":"American sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/9/92/White-crowned-Sparrow.jpg","summary":"American sparrows are a group of mainly New World passerine birds, forming the family Passerellidae. American sparrows are seed-eating birds with conical bills, brown or gray in color, and many species have distinctive head patterns.\nAlthough they share the name sparrow, American sparrows are more closely related to Old World buntings than they are to the Old World sparrows (family Passeridae). American sparrows are also similar in both appearance and habit to finches, with which they sometimes used to be classified."},{"id":508889,"url":"https://en.wikipedia.org/wiki/Ammodramus","title":"Ammodramus","image":"https://upload.wikimedia.org/wikipedia/en/4/4a/Commons-logo.svg","summary":"Ammodramus is a genus of birds in the family Passerellidae, in the group known as American sparrows. Birds of this genus are known commonly as Grassland sparrows. The name Ammodramus is from the Greek for \"sand runner\".These birds live in grassland habitat. Some Ammodramus are socially monogamous and both parents care for the young. Other species are polygynous with no pair bonding and no paternal care.Numerous species have been included in this genus, but have been reclassified into different genera by sources such as Birdlife International. Current species in this genus include:"},{"id":64922341,"url":"https://en.wikipedia.org/wiki/Ammospiza","title":"Ammospiza","image":"https://upload.wikimedia.org/wikipedia/commons/e/eb/Saltmarsh_sharp_tailed_sparrow.jpg","summary":"Ammospiza is a genus of birds in the family Passerellidae, in the group known as American sparrows."},{"id":12760348,"url":"https://en.wikipedia.org/wiki/Amphispiza","title":"Amphispiza","image":"https://upload.wikimedia.org/wikipedia/commons/1/1c/Amphispiza_bilineataPCCA20050311-5951B.jpg","summary":"Amphispiza is a genus of birds in the American sparrow family. It contains two species:\n\nFive-striped sparrow Amphispiza quinquestriata\nBlack-throated sparrow, Amphispiza bilineataIt has long been considered to contain the sage sparrow complex as well, but mitochondrial DNA sequences suggest that the sage sparrow (in the broad sense) is not very closely related to the five-striped and black-throated sparrows, so it has been placed in its own genus, Artemisiospiza, a treatment followed here.\nBoth Amphispiza species inhabit dry areas of the western United States and northern Mexico, but in different habitats.  They frequently run on the ground with their tails cocked and sing from low bushes.  Adults are whitish on the belly and gray above and on the head, with black and white head markings.  Juveniles are rather similar to each other, grayish brown above and whitish below, with short streaks on the breast.The genus name Amphispiza derives from the two Ancient Greek words αμφι (amphi), meaning \"on both sides\" or \"around\", and σπίζα (spíza), a catch-all term for finch-like birds, originally applied to the sage sparrow. It was then considered a finch and resembles some other finch-like birds \"around\" it, that is, in its range."},{"id":12436171,"url":"https://en.wikipedia.org/wiki/Arremonops","title":"Arremonops","image":"https://upload.wikimedia.org/wikipedia/commons/d/da/Arremonops_rufivirgatus.jpg","summary":"Arremonops is a genus of Neotropical birds in the family Passerellidae.  All species are found in Central America, Mexico, and/or northern South America.  The olive sparrow reaches southern Texas."},{"id":36533086,"url":"https://en.wikipedia.org/wiki/Artemisiospiza","title":"Artemisiospiza","image":"https://upload.wikimedia.org/wikipedia/commons/e/eb/Amphispiza_belli_nevadensis2.jpg","summary":"Artemisiospiza is a genus of birds in the American sparrow family, formally described by Klicka and Banks, 2011. It contains two species:\n\nSagebrush sparrow Artemisiospiza nevadensis\nBell's sparrow, Artemisiospiza belliThe two species historically comprised the sage sparrow complex, but were split in 2013 by the American Ornithological Society.\nBoth Artemisiospiza species inhabit dry areas of the western United States and northern Mexico."},{"id":64923006,"url":"https://en.wikipedia.org/wiki/Centronyx","title":"Centronyx","image":"https://upload.wikimedia.org/wikipedia/commons/2/25/Henslows_Sparrow_%28Ammodramus_henslowii%29_%285752598436%29.jpg","summary":"Centronyx is a genus of birds in the family Passerellidae, in the group known as American sparrows."},{"id":345410,"url":"https://en.wikipedia.org/wiki/Fox_sparrow","title":"Fox sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/1/13/Passerella_iliaca-001.jpg","summary":"The fox sparrow (Passerella iliaca) is a large American sparrow. It is the only member of the genus Passerella, although some authors split the species into four (see below)."},{"id":484282,"url":"https://en.wikipedia.org/wiki/Junco","title":"Junco","image":"https://upload.wikimedia.org/wikipedia/commons/0/04/Junco_hyemalis_hyemalis_CT2.jpg","summary":"\"Junco\" is also a shrub in the genus Adolphia and the Spanish term for rushes (genus Juncus).\n\nA junco , genus Junco, is a small North American bird. Junco systematics are still confusing after decades of research, with various authors accepting between three and 12 species. Despite having a name that appears to derive from the Spanish term for the plant genus Juncus (rushes), these birds are seldom found among rush plants, as these prefer wet ground, while juncos like dry soil.\nTheir breeding habitat is coniferous or mixed forest areas throughout North America, ranging from subarctic taiga to high-altitude mountain forests in Mexico and Central America south to Panama. Northern birds usually migrate farther south; southern populations are permanent residents or altitudinal migrants, moving only a short distance downslope to avoid severe winter weather in the mountains.\nThese birds forage on the ground. In winter, they often forage in flocks. They eat mainly insects and seeds. They usually nest in a well-hidden location on the ground or low in a shrub or tree."},{"id":506116,"url":"https://en.wikipedia.org/wiki/Lark_bunting","title":"Lark bunting","image":"https://upload.wikimedia.org/wikipedia/commons/a/a1/NRCSCO01003%2815150%29%28NRCS_Photo_Gallery%29.jpg","summary":"The lark bunting (Calamospiza melanocorys) is a medium-sized American sparrow native to central and western North America. It is also the state bird of Colorado."},{"id":12635570,"url":"https://en.wikipedia.org/wiki/Melospiza","title":"Melospiza","image":"https://upload.wikimedia.org/wikipedia/commons/c/c7/Song_Sparrow_0030.jpg","summary":"Melospiza is a genus of passerine birds formerly placed in the family Emberizidae, but it is now placed in Passerellidae. The genus, commonly referred to as \"song sparrows,\" currently contains three species, all of which are native to North America.\nMembers of Melospiza are medium-sized sparrows with long tails, which are pumped in flight and held moderately high on perching. They are not seen in flocks, but as a few individuals or solitary. They prefer brushy habitats, often near water."},{"id":12462709,"url":"https://en.wikipedia.org/wiki/Melozone","title":"Melozone","image":"https://upload.wikimedia.org/wikipedia/commons/e/e4/Pipilo_fuscus2.jpg","summary":"Melozone is a genus of mostly Neotropical birds in the family Passerellidae, found mainly in Mexico. Three species reach as far north as the southwestern United States, two species reach as far south as Costa Rica, and two are endemic to Mexico. The following species are in the genus Melozone:\nAbert's towhee (Melozone aberti)\nCabanis's ground sparrow (Melozone cabanisi)\nCalifornia towhee (Melozone crissalis)\nCanyon towhee (Melozone fusca)\nPrevost's ground sparrow (Melozone biarcuata)\nRusty-crowned ground sparrow (Melozone kieneri)\nWhite-eared ground sparrow (Melozone leucotis)\nWhite-throated towhee (Melozone albicollis)"},{"id":1459299,"url":"https://en.wikipedia.org/wiki/Passerculus","title":"Passerculus","image":"https://upload.wikimedia.org/wikipedia/commons/2/29/Passerculus-sandwichensis-001.jpg","summary":"Passerculus is a genus of birds that belongs to the New World sparrow family Passerellidae. While formerly considered to include just the Savannah sparrow (P. sandwichensis), recent studies by Birdlife International indicate that there 6 species in the genus. Species found in this genus include:\n\nSavannah sparrow, Passerculus sandwichensis\nHenslow's sparrow, Passerculus henslowii\nBaird's sparrow, Passserculus bairdii\nLarge-billed sparrow, Passerculus rostratus\nBelding's sparrow, Passerculus guttatus\nSan Benito sparrow, Passerculus sanctorum"},{"id":30203705,"url":"https://en.wikipedia.org/wiki/Peucaea","title":"Peucaea","image":"https://upload.wikimedia.org/wikipedia/commons/0/0c/Cassin%27s_Sparrow%2C_Peucaea_cassinii.jpg","summary":"Peucaea is a genus of American sparrows. The species in this genus used to be included in the genus Aimophila."},{"id":391347,"url":"https://en.wikipedia.org/wiki/Pipilo","title":"Pipilo","image":"https://upload.wikimedia.org/wikipedia/commons/d/de/Spotted_Towhee_%28Pipilo_maculatus%29.jpg","summary":"Pipilo is a genus of birds in the family Passerellidae (which also includes the American sparrows and juncos).  It is one of two genera of birds usually identified as towhees.\nThe genus Pipilo was introduced by the French ornithologist Louis Jean Pierre Vieillot in 1816 with the eastern towhee as the type species. The name Pipilo is New Latin for \"bunting\" from pipilare \"to chirp\".There has been considerable debate over the taxonomy of towhees in recent years. Two species complexes have been identified, the rufous-sided complex (involving Pipilo erythrophthalmus, P. maculatus, P. socorroensis, P. ocai and P. chlorurus), and the brown towhee complex (involving Melozone crissalis, M. fuscus, M. aberti and M. albicollis). The distinction of species within these is uncertain and opinions have differed over the years. Modern authorities distinguish all four species in the brown towhee complex, though M. fuscus and M. crissalis were formerly treated as a single species. Hybrids are frequent between some of the species, particularly between the Mexican races of P. maculatus (olive-backed towhee, P. maculatus macronyx) and P. ocai."},{"id":6550154,"url":"https://en.wikipedia.org/wiki/Rufous-collared_sparrow","title":"Rufous-collared sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/5/50/Rufous-collared_sparrow_%28Zonotrichia_capensis_costaricensis%29_2.jpg","summary":"The rufous-collared sparrow or Andean sparrow (Zonotrichia capensis) is an American sparrow found in a wide range of habitats, often near humans, from the extreme south-east of Mexico to Tierra del Fuego, and in the Caribbean, only on the island of Hispaniola. It is famous for its diverse vocalizations, which have been intensely studied since the 1970s, particularly by Paul Handford and Stephen C. Lougheed (UWO), Fernando Nottebohm (Rockefeller University) and Pablo Luis Tubaro (UBA). Local names for this bird include the Portuguese tico-tico, the Spanish chingolo, chincol and copetón, \"tufted\" in Colombia and comemaíz \"corn eater\" in Costa Rica."},{"id":413741,"url":"https://en.wikipedia.org/wiki/Lark_sparrow","title":"Lark sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/7/79/LarkSparrow.jpg","summary":"The lark sparrow (Chondestes grammacus) is a fairly large American sparrow. It is the only member of the genus Chondestes."},{"id":413732,"url":"https://en.wikipedia.org/wiki/Savannah_sparrow","title":"Savannah sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/a/af/Passerculus_sandwichensis_crop.jpg","summary":"The Savannah sparrow (Passerculus sandwichensis) is a small American sparrow. It was the only member of the genus Passerculus and is typically the only widely accepted member. Comparison of mtDNA NADH dehydrogenase subunit 2 and 3 sequences indicates that the Ipswich sparrow, formerly usually considered a valid species (as Passerculus princeps), is a well-marked subspecies of the Savannah sparrow, whereas the southwestern large-billed sparrow should be recognized as a distinct species (Passerculus rostratus).The common name comes from Savannah, Georgia, where one of the first specimens of this bird was collected."},{"id":6024329,"url":"https://en.wikipedia.org/wiki/Sierra_Madre_sparrow","title":"Sierra Madre sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/8/84/Xenospiza_baileyi.jpg","summary":"The Sierra Madre sparrow (Xenospiza baileyi), also known as Bailey's sparrow, is an endangered, range-restricted, enigmatic American sparrow.  It is endemic to Mexico and is threatened with extinction through habitat loss."},{"id":508847,"url":"https://en.wikipedia.org/wiki/Spizella","title":"Spizella","image":"https://upload.wikimedia.org/wikipedia/commons/1/15/FieldSparrow23.jpg","summary":"The genus Spizella is a group of American sparrows in the family Passerellidae.These birds are fairly small and slim, with short bills, round heads and long wings. They are usually found in semi-open areas, and outside of the nesting season they often forage in small mixed flocks."},{"id":12469183,"url":"https://en.wikipedia.org/wiki/Striped_sparrow","title":"Striped sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/f/f6/Oriturus_superciliosus_-_cropped.jpg","summary":"The striped sparrow (Oriturus superciliosus) is a species of bird in the family Passerellidae. It is monotypic within the genus Oriturus.\nIt is endemic to Mexico where its natural habitats are subtropical or tropical moist montane forest and temperate grassland."},{"id":429433,"url":"https://en.wikipedia.org/wiki/Vesper_sparrow","title":"Vesper sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/c/cd/Pooecetes_gramineus_-USA-8.jpg","summary":"The vesper sparrow (Pooecetes gramineus) is a medium-sized American sparrow. It is the only member of the genus Pooecetes."},{"id":12292601,"url":"https://en.wikipedia.org/wiki/Zapata_sparrow","title":"Zapata sparrow","image":"https://upload.wikimedia.org/wikipedia/commons/6/62/Zapata_sparrow_%28Torreornis_inexpectata_varonai%29.JPG","summary":"The Zapata sparrow (Torreornis inexpectata) is a medium-sized grey and yellow bird that lives in the grasslands of the Zapata Swamp and elsewhere on the island of Cuba. Measuring about 16.5 centimetres (6.5 in) in length, it is grey and yellow overall with a dark reddish-brown crown and olive-grey upperparts.\nThe Zapata sparrow is confined and endemic to Cuba. It was discovered by Spanish zoologist, Fermín Zanón Cervera in March 1927 around Santo Tomás in the Zapata Swamp and formally described by American herpetologist Thomas Barbour and his compatriot, ornithologist James Lee Peters in 1927.Barbour had been accompanied by Cervera on his previous visits to Cuba, and on hearing of the strange birds to be found in the Zapata area, he sent the Spaniard on a series of trips into the region, eventually leading to the finding of the sparrow. Two other populations have since been discovered, on the island of Cayo Coco in Camagüey Province and in a coastal region in Guantánamo Province. As the species is no longer confined to Zapata the alternative name of Cuban sparrow is sometimes suggested.\nEach population is assigned to a different race due to differences in plumage and ecology. The nominate race T. i. inexpectana at Zapata is found in extensive sawgrass savannahs, the similarly-plumaged Cayo Coco race T. i. varonai is found in forests and shrubbery and the duller eastern race T. i. sigmani frequents arid areas of thorn-scrub and cacti."},{"id":6569805,"url":"https://en.wikipedia.org/wiki/Zonotrichia","title":"Zonotrichia","image":"https://upload.wikimedia.org/wikipedia/commons/5/5f/Zonotrichia_leucophrys1.jpg","summary":"Zonotrichia is a genus of five extant American sparrows of the family Passerellidae. Four of the species are North American, but the  rufous-collared sparrow breeds in highlands from the extreme southeast of Mexico to Tierra del Fuego, and on Hispaniola."},{"id":4470304,"url":"https://en.wikipedia.org/wiki/Category:Passerella","title":"Category:Passerella","image":"https://upload.wikimedia.org/wikipedia/en/4/4a/Commons-logo.svg","summary":""}];

// App
const app = express();

app.use(function(req, res, next) {
  // Allows our locally running react client to connect to this locally running api.
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/v1/functions', (req, res) => {

  if(stub) {
    res.json(stubLabels);
    return;
  }

  var client = new Client(clientConn);
  client.connect()
  client.query('SELECT * FROM Label', (err, result) => {
    client.end()
    if(err) {
      console.log(err.stack);
      res.json({error: true});
    }
    else {
      res.json(result.rows);
    }
  })
});

app.get('/v1/search', (req, res) => {
  // ?q=1 where 1 is a function id.
  // get all wikipedia article ids that have that function id assigned.
  // use wikijs to query the wikipedia api and return article titles and summaries to display on the client.

  if(stub) {
    res.json(stubArticles);
    return;
  }
  console.log(req.query)
  var label_id = req.query.q;
  console.log(label_id)
  var er = /^[0-9]+$/;
  if(!er.test(label_id)) {
    res.json({error: true});
    return;
  }

  

  var client = new Client(clientConn);
  client.connect()
  client.query('SELECT article_id FROM Wikipedia_Label WHERE label_id = $1', [label_id], (err, result) => {
    client.end()
    if(err) {
      console.log(err.stack);
      res.json({error: true});
      return;
    }
    else {
      getWikiArticles(result.rows);
    }
  })

  // Fixes an error: https://github.com/dijs/wiki/issues/136
  var headers = { headers: { 'User-Agent': 'server.js (https://github.com/nasa/petal-api; bruffridge@nasa.gov) wiki.js' } }

  function getWikiArticles(article_ids) {
    var tempPages, tempImages;
    var articles = [];

    getPages(article_ids)
    .then(pages => {
      tempPages = pages;
      return getImages(pages);
    })
    .then(images => {
      tempImages = images;
      return getSummaries(tempPages);
    })
    .then(summaries => {
      var i = 0;
      for (var page of tempPages) {
        var article = {
          id: page.raw.pageid,
          url: page.raw.fullurl,
          title: page.raw.title,
          image: tempImages[i],
          summary: summaries[i]
        }
        articles.push(article);
        i++;
      }
      res.json(articles);
    })
    .catch(error => console.log(error));
  }

  function getPages(pageIds) {
    var promises = [];
    //var articles = [];
    for (var article of pageIds) {
      promises.push(wiki(headers).findById(article.article_id));
    }
    return Promise.all(promises);
  }
  
  function getSummaries(pages) {
    var promises = [];
    for (var page of pages) {
      promises.push(page.summary());
    }
    return Promise.all(promises);
  }

  function getImages(pages) {
    var promises = [];
    for (var page of pages) {
      promises.push(page.mainImage());
    }
    return Promise.all(promises);
  }
});

app.post('/api', (request, response) => {
  //console.log('got it');
  //console.log(request.body);
  response.json({
    status: 'success'
  });
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);