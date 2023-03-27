import { Router } from "express";
import { 
  findTrainers,
  findTrainer,
  upsertTrainer,
  deleteTrainer,
} from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get(
  "/hello", 
  (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get(
  "/trainers", 
  async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    const trainerNames = trainers.map(({ Key }) => Key.replace(/\.json$/, ""));
    //res.send(trainers);
    res.send(trainerNames);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post(
  "/trainer", 
  async (req, res, next) => {
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    //console.log( req.body )
    if (!("name" in req.body && req.body.name.length > 0))
      return res.sendStatus(400);

    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    const trainers = await findTrainers();
    //console.log( trainers )
    if (trainers.some(({ Key }) => Key === `${req.body.name}.json`))
      return res.sendStatus(409);
    
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
// TODO: トレーナーを取得する API エンドポイントの実装
router.get(
  "/trainer/:trainerName", 
  async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    //console.log( trainerName )
    const trainer = await findTrainer(trainerName);
    //console.log( trainer )
    res.send(trainer);
  } catch (err) {
    next(err);
  }
});


/** トレーナーの更新 */
router.post(
  "/trainer/:trainerName", 
  async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装
router.delete(
  "/trainer/:trainerName", 
  async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const result = await deleteTrainer(trainerName);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});


/** ポケモンの追加 */
router.put(  
  "/trainer/:trainerName/pokemon/:pokemonName",
  async (req, res, next) => {
    try {
      const { trainerName, pokemonName } = req.params;
      const trainer = await findTrainer(trainerName);
      //console.log( "Trainer" , trainer )

      const pokemon = await findPokemon(pokemonName);
      //console.log( "Pokemon" , pokemon , pokemonName)

      const {
        order,
        name,
        sprites: { front_default },
      } = pokemon;
      //console.log( "Pokemon" , name , order)

      trainer.pokemons.push({
        id: (trainer.pokemons[trainer.pokemons.length - 1]?.id ?? 0) + 1,
        nickname: "",
        order,
        name,
        sprites: { front_default },
      });

      // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
      const result = await upsertTrainer(trainerName, trainer);
      res.status(result["$metadata"].httpStatusCode).send(result);
    } catch (err) {
      next(err);
    }
  }
);

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装
router.delete(
  "/trainer/:trainerName/pokemon/:pokemonId",
  async (req, res, next) => {
    try {
      const {trainerName,pokemonId} = req.params;
      console.log(trainerName , pokemonId);

      const trainer = await findTrainer(trainerName);
      //console.log( "Trainer" , trainer )
      //console.log( "Trainer" , trainer.name )
      
      /*
      const pokemon1 = trainer.pokemons.find(
          (v) => v.name == "pikachu"
      );
      console.log("PokemonIndex" , pokemon1 , pokemon1.name);
      */
      
      //findIndex関数
      const index = trainer.pokemons.findIndex(
        (pokemon) => String(pokemon.id) === pokemonId
      );
      console.log("PokemonID" , pokemonId , index);
      
      trainer.pokemons.splice(index, 1);
      
      const result = await upsertTrainer(trainerName, trainer);
      res.status(result["$metadata"].httpStatusCode).send(result);
    }
    
    catch(err){
      next(err);
    }
  }
);



export default router;
