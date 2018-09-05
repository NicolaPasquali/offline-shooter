import Player from '../models/Player';
import EnemiesFactory from '../models/enemies/EnemiesFactory';
import InformationDisplay from './InformationDisplay';
import PlayerControls from './PlayerControls';
import Renderer from './Renderer';

export default class BattleSystem {
    constructor() {
        this.renderer = new Renderer();
        this.playerControls = new PlayerControls();
        this.player = new Player();
        this.enemies = [];
        this.informationDisplay = new InformationDisplay(this.player, this.enemies);
    }

    startBattle() {
        this._spawnEnemies();
        this._render();
        this._loopBattle();
    }

    _spawnEnemies() {
        this.enemies = EnemiesFactory.spawnBasicEnemies(250, 175, 5);
        this.informationDisplay.enemies = this.enemies;
        setTimeout(() => this.playerControls.initializeEnemySelectionEvents());
    }

    _loopBattle() {
        this._stepBattle()
            .then((enemiesLeft) => {
                if (enemiesLeft > 0) {
                    this._loopBattle();
                } else {
                    this.startBattle();
                }
            });
    }

    _stepBattle() {
        return this.playerControls.awaitForAction()
            .then((selectedAction) => {
                this._managePlayerAction(selectedAction);
                this.enemies.forEach((enemy) => enemy.attack(this.player));
                this._render();
                return this.enemies.length;
            });
    }

    _managePlayerAction(selectedAction) {
        switch (selectedAction) {
            case 'write-code':
                this._attackSelectedEnemy(10);
                break;
            case 'debug':
                this._attackSelectedEnemy(15);
                break;
            case 'meditate':
                this.player.addFocus(10);
                break;
            case 'meeting':
                this._attackSelectedEnemy(15);
                break;
            case 'pair-programming':
                this._attackSelectedEnemy(20);
                break;
            case 'procrastinate':
                this.player.relieveStress(10);
                break;
            default:
                break;
        }
    }

    _attackSelectedEnemy(damageAmount) {
        if (this.playerControls.selectedEnemyId) {
            let enemy = this.enemies.find((enemy) => {
                return enemy.id === this.playerControls.selectedEnemyId;
            });

            if (enemy) {
                let isDead = enemy.damage(damageAmount);
                if (isDead) {
                    let index = this.enemies.findIndex((enemy) => {
                        return enemy.id === this.playerControls.selectedEnemyId;
                    });
                    this.enemies.splice(index, 1);
                    this.informationDisplay.enemies = this.enemies;
                    this.informationDisplay.deleteEnemy(this.playerControls.selectedEnemyId);
                }
            }
        }
    }

    _render() {
        this.renderer.renderEnemies(this.enemies);
        this.informationDisplay.render();
    }
}
