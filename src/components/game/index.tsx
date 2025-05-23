import { PlayerId } from "rune-sdk";
import { useInterval } from "../../hooks/index.ts";
import {
  Ball,
  Canon,
  Counter,
  Grid,
  PreviewShips,
  RenderShips,
  RenderTiles,
} from "./components/";
import {
  ElocationScreen,
  INITIAL_COUNTER_TIMER,
  INITIAL_SHOOT_BULLET,
  TIME_COUNTDOWN,
} from "../../utils/constants.ts";
import {
  getOrderIndices,
  makeRandomShot,
  setBallCanon,
  setCannonsPositions,
  validaFinishesMoveBall,
  validateShootingBullet,
} from "./helpers.ts";
import PageWrapper from "../wrapper/page";
import React, { useEffect, useRef, useState } from "react";
import type {
  IShootBullet,
  TElocationScreen,
  GameState,
  IPositionShipCells,
  TColorDistribution,
} from "../../interfaces/index.ts";

function Game() {
  /**
   * Referencia de la bola, para validar si la animación de moviento
   * ha finalizado
   */
  const ballRef = useRef<HTMLDivElement>(null);

  /**
   * Contador para iniciar el juego...
   */
  const [counterTimer, setCounterTimer] = useState(INITIAL_COUNTER_TIMER);

  /**
   * Guarda el estado del juego (proviene de RUNE)
   */
  const [game, setGame] = useState<GameState>();

  /**
   * Guarda el id del juegador actual de cada sesión...
   */
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  /**
   * Estado local para establecer las acciones cuando se dipara la bola
   */
  const [shootBullet, setShootBullet] =
    useState<IShootBullet>(INITIAL_SHOOT_BULLET);

  /**
   * Se cal el ID del usuario que tien el turno
   */
  const turnID = game?.turnID || "";

  /**
   * Determinar si el juego ha terminado...
   */
  const isGameOver = game?.isGameOver || false;

  /**
   * Se valida el orden en el que se muestra la información...
   */
  const orderIndices = getOrderIndices(game?.players || [], yourPlayerId || "");

  /**
   * Se indica si el usuario tiene el turno...
   */
  const hasTurn = yourPlayerId === turnID;

  /**
   * Efecto que escucha cuando hay cambios en el estado del juego,
   * eventos que vienen del server.
   */
  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId, event }) => {
        /**
         * Determina si se ha reiniciando el juego
         */
        const isNewGame = (event?.name || "") === "stateSync";

        /**
         * Se guarda el estado del juego que proviene del servicio...
         */
        setGame(game);

        /**
         * Indica que es evento inicial cuando inicia el juego
         */
        if (!action) {
          setYourPlayerId(yourPlayerId);
        }

        if (isNewGame) {
          /**
           * Se determina la ubicación de disparo
           */
          const currentTurn = yourPlayerId === game.turnID;
          const canonTopVisible = !currentTurn;
          const shootingLocation: TElocationScreen = canonTopVisible
            ? ElocationScreen.TOP
            : ElocationScreen.BOTTOM;

          setBallCanon({
            location: shootingLocation,
            setShootBullet,
          });

          setCounterTimer({ ...INITIAL_COUNTER_TIMER, start: true });
        }

        /**
         * Evento de selección de celda/Tile
         */
        if (action?.name === "onSelectCell") {
          validateShootingBullet({
            game,
            yourPlayerId: yourPlayerId || "",
            setShootBullet,
          });
        }
      },
    });
  }, []);

  /**
   * Efecto que escucha cuando la aniamción de movimiento de la bola
   * ha terminado...
   */
  useEffect(() => {
    if (ballRef.current) {
      const ballDoom = ballRef.current;

      /**
       * Evento que escucha ciuando la animación de movimiento de la
       * bola ha terminado...
       */
      const onTransitionEnd = () => {
        validaFinishesMoveBall({
          shootBullet,
          setShootBullet,
        });
      };

      ballDoom.addEventListener("transitionend", onTransitionEnd);

      return () => {
        ballDoom.removeEventListener("transitionend", onTransitionEnd);
      };
    }
  }, [shootBullet]);

  /**
   * Hook que establece el contador inicial para empezar el juego...
   */
  useInterval(
    () => {
      const newValue = counterTimer.value - 1;
      setCounterTimer({ ...counterTimer, value: newValue });

      if (newValue < 0) {
        setCounterTimer({ ...counterTimer, start: false });

        const canonTopVisible = !hasTurn;
        const shootingLocation: TElocationScreen = canonTopVisible
          ? ElocationScreen.TOP
          : ElocationScreen.BOTTOM;

        setCannonsPositions({
          location: shootingLocation,
          setShootBullet,
        });
      }
    },
    counterTimer.start ? TIME_COUNTDOWN : null
  );

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  const { players } = game;

  /**
   * Evento cuando se hace click en una celda..
   * @param cell
   */
  const onClickTile = (cell: IPositionShipCells) => {
    /**
     * Sólo se envia en caso que el juego no haya terminado,
     * además que el usuario tenga el turno y además no exista
     * una animación de la bola...
     */
    if (!isGameOver && hasTurn && !shootBullet.isAnimate) {
      Rune.actions.onSelectCell(cell);
    }
  };

  /**
   * Valida que el tiempo se ha acabado y hace un lanzamiento aleatorio
   */
  const handleInterval = () => {
    if (hasTurn) {
      onClickTile(makeRandomShot(shootBullet.usedTiles));
    }
  };

  // Se calcula dependiendo del usuario...
  const colorDistribution: TColorDistribution = {
    TOP: players[orderIndices[0]].color,
    BOTTOM: players[orderIndices[1]].color,
  };

  /**
   * Calcula el color actual que tiene el turno
   */
  const currentColor = hasTurn
    ? colorDistribution.BOTTOM
    : colorDistribution.TOP;

  return (
    <PageWrapper>
      <Grid
        colorDistribution={colorDistribution}
        shake={shootBullet.shake}
        currentColor={currentColor}
      >
        {counterTimer.start && <Counter value={counterTimer.value} />}
        <Canon
          locationScreen={ElocationScreen.TOP}
          color={colorDistribution.TOP}
          showCanon={shootBullet.canonTopVisible}
          rotation={shootBullet.canonTopRotation}
          isAnimate={shootBullet.isAnimate}
          handleInterval={handleInterval}
        />
        <RenderTiles
          colorDistribution={colorDistribution}
          onClickTile={onClickTile}
          usedTiles={shootBullet.usedTiles}
          selectedCell={shootBullet.selectedCell}
          showBottomCanon={shootBullet.canonBottomVisible}
        />
        <PreviewShips
          colorDistribution={colorDistribution}
          uncoverShips={shootBullet.uncoverShips}
        />
        <RenderShips
          orderIndices={orderIndices}
          players={players}
          uncoverShips={shootBullet.uncoverShips}
          yourPlayerId={yourPlayerId}
        />
        <Canon
          locationScreen={ElocationScreen.BOTTOM}
          color={colorDistribution.BOTTOM}
          showCanon={shootBullet.canonBottomVisible}
          rotation={shootBullet.canonBottomRotation}
          isAnimate={shootBullet.isAnimate}
          handleInterval={handleInterval}
        />
        <Ball
          coordinate={shootBullet.positionBall}
          isAnimate={shootBullet.isAnimate}
          ref={ballRef}
        />
      </Grid>
    </PageWrapper>
  );
}

export default React.memo(Game);
