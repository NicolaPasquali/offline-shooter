import Player from '../models/Player';
import EnemiesFactory from './EnemiesFactory';
import InformationDisplay from './InformationDisplay';
import PlayerControls from './PlayerControls';
import Renderer from './Renderer';
import EventLogger from './EventLogger';
import AttackManager from "./AttackManager";

export default class BattleSystem {
    constructor() {
        this.renderer = new Renderer();
        this.playerControls = new PlayerControls();
        this.player = new Player();
        this.enemies = [];
        this.informationDisplay = new InformationDisplay(this.player, this.enemies);
        this._numberOfFight = 0;
    }

    startBattle() {
        this._numberOfFight++;
        EventLogger.battleStarted(this._numberOfFight);
        this._spawnEnemies();
        this._render();
        this._loopBattle();
    }

    _spawnEnemies() {
        this.enemies = EnemiesFactory.spawnBasicEnemies(250, 175, 5);
        this.informationDisplay.enemies = this.enemies;
    }

    _render() {
        this.renderer.renderEnemies(this.enemies);
        this.informationDisplay.render();
    }

    _loopBattle() {
        this._stepBattle()
            .then((enemiesLeft) => {
                if (enemiesLeft > 0) {
                    this._loopBattle();
                } else {
                    this._endBattleMessage();
                    this.startBattle();
                }
            });
    }

    _stepBattle() {
        setTimeout(() => this.playerControls.addEnemySelectionEvents());
        return this.playerControls.awaitForAction()
            .then((selectedAction) => {
                if (this._managePlayerAction(selectedAction)) {
                    this.enemies.forEach((enemy) => enemy.attack(this.player));
                    this._render();
                }
                return this.enemies.length;
            });
    }

    _managePlayerAction(selectedAction) {
        if (selectedAction.cost <= this.player.focus) {
            this.player.focus -= selectedAction.cost;
            let selectedEnemy = this.enemies.find((enemy) => enemy.id === this.playerControls.selectedEnemyId);
            if (AttackManager.managePlayerAction(selectedAction.name, this.player, selectedEnemy)) {
                this._manageDeadEnemy(selectedEnemy);
            }
            return true;
        }
        alert('Not enough focus');
        return false;
    }

    _manageDeadEnemy(enemy) {
        EventLogger.death(enemy.name);
        let index = this.enemies.findIndex((enemy) => enemy.id === this.playerControls.selectedEnemyId);
        this.enemies.splice(index, 1);
        this.informationDisplay.enemies = this.enemies;
        this.informationDisplay.deleteEnemy(this.playerControls.selectedEnemyId);
    }

    _endBattleMessage() {
        EventLogger.battleEnded(this._numberOfFight);
    }
}
