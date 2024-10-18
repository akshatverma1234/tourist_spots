const Place = require("../models/place")
const Comments = require("../models/comments")

const place_seeds = [
  {
    name: "Taj Mahal",
    description:
      "Nestled on the banks of Yamuna River, Agra welcomes tourists with its Mughal-era structures, UNESCO World Heritage Sites, one of the Seven Wonders of the World, magnificent forts, tombs and pulsating markets.",
    location: "Agra",
    author: "Akshat",
    date: "2024-10-23T00:00:00.000Z",
    rating: 3,
    tags: "Mahal",
    color: true,
    image:
      "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Agra_destjulimg_1_l_830_1277.jpg",
  },
  {
    name: "Agra Fort",
    description:
      "A place of residence of the Mughal emperors till 1638, this 16th century fort was built by Akbar and is now a World Heritage Site.",
    location: "Agra",
    author: "Akshat",
    date: "2024-10-14T00:00:00.000Z",
    rating: 4,
    tags: "Mahal",
    color: true,
    image:
      "https://hblimg.mmtcdn.com/content/hubble/img/agra/mmt/activities/m_activities_agra_agra_fort_2_l_438_689.jpg",
  },
  {
    name: "Varanasi",
    description:
      "Situated on the banks of River Ganga in Uttar Pradesh, Varanasi is considered as one of the holiest cities, drawing tourists who seek spiritual awareness and liberation.",
    location: "Banaras, Uttar Pradesh",
    author: "Akshat",
    date: "2024-10-14T00:00:00.000Z",
    rating: 5,
    tags: " Holiest",
    color: true,
    image:
      "https://hblimg.mmtcdn.com/content/hubble/img/varanasi/mmt/destination/m_destination-varanasi-landscape_l_400_640.jpg",
  },
]

const seed = async () => {
  await Place.deleteMany()
  console.log("Deleted All The Places")

  await Comments.deleteMany()
  console.log("Deleted All The Comments")

  // for(const place_seed of place_seeds){
  //     let place = await Place.create(place_seed);
  //     console.log("Create a new place: " + place.name);

  //     await Comments.create({
  //         text:"I love this Place",
  //         user:"Mitanshu",
  //         placeId: place._id
  //     })
  //     console.log("Create a new comment!");
  // }
}
module.exports = seed
