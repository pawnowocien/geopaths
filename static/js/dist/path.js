import { getCoords, lines_overlay, getBoardId, eraseMaps, resetCurrPath } from "./board-state.js";
const xmlns = 'http://www.w3.org/2000/svg';
export class Tile {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    toString() {
        return "T" + this.row.toString() + "_" + this.col.toString();
    }
}
export class Path {
    gen_circle(tile) {
        if (lines_overlay === undefined)
            return;
        const circle = document.createElementNS(xmlns, 'circle');
        circle.setAttribute('cx', getCoords(tile).x.toString());
        circle.setAttribute('cy', getCoords(tile).y.toString());
        let rad = this.width / 2;
        // if (big) rad *= 3;
        circle.setAttribute('r', (rad).toString());
        circle.setAttribute('fill', this.color);
        circle.setAttribute('id', tile.toString());
        // if (path_id === "in-proc") {
        //     circle.setAttribute('opacity', '0.5');
        // }
        // circle.setAttribute('data-path-id', path_id);
        this.delete = this.delete.bind(this);
        circle.addEventListener('contextmenu', this.delete);
        circle.addEventListener('mouseenter', () => this.check_to_remove(tile.row, tile.col));
        this.group.appendChild(circle);
    }
    gen_line(tile1, tile2) {
        if (lines_overlay === undefined)
            return;
        const line_between = document.createElementNS(xmlns, 'line');
        const { x: x1, y: y1 } = getCoords(tile1);
        const { x: x2, y: y2 } = getCoords(tile2);
        let x1_str = x1.toString();
        let y1_str = y1.toString();
        let x2_str = x2.toString();
        let y2_str = y2.toString();
        line_between.setAttribute('x1', x1_str);
        line_between.setAttribute('y1', y1_str);
        line_between.setAttribute('x2', x2_str);
        line_between.setAttribute('y2', y2_str);
        line_between.setAttribute('stroke', this.color);
        line_between.setAttribute('stroke-width', this.width.toString());
        line_between.setAttribute('id', tile1.toString() + '_' + tile2.toString());
        this.delete = this.delete.bind(this);
        line_between.addEventListener('contextmenu', this.delete);
        line_between.addEventListener('mouseenter', () => this.check_to_remove(tile2.row, tile2.col));
        line_between.style.display = 'block';
        this.group.appendChild(line_between);
    }
    generate() {
        if (!this.finished) {
            this.group.setAttribute('opacity', '0.5');
        }
        for (const tile of this.tiles) {
            this.gen_circle(tile);
        }
        for (let i = 1; i < this.tiles.length; i++) {
            this.gen_line(this.tiles[i - 1], this.tiles[i]);
        }
        if (this.tiles.length > 0 && !this.finished) {
            const startingCircle = this.group.querySelector(`#${this.tiles[0].toString()}`);
            if (startingCircle) {
                const baseRadius = (this.width * 3) / 2;
                startingCircle.setAttribute('r', baseRadius.toString());
                const animate = document.createElementNS(xmlns, 'animate');
                animate.setAttribute('attributeName', 'r');
                animate.setAttribute('values', `${baseRadius};${baseRadius * 1.5};${baseRadius}`);
                animate.setAttribute('dur', '1s');
                animate.setAttribute('repeatCount', 'indefinite');
                animate.setAttribute('begin', '0s');
                animate.setAttribute('fill', 'freeze');
                startingCircle.appendChild(animate);
            }
        }
    }
    constructor(tiles, color, width, finished) {
        this.tiles = tiles;
        this.color = color;
        this.width = width;
        this.finished = finished;
        this.group = document.createElementNS(xmlns, 'g');
        this.delete = this.delete.bind(this);
        this.group.addEventListener('contextmenu', this.delete);
        lines_overlay === null || lines_overlay === void 0 ? void 0 : lines_overlay.appendChild(this.group);
        this.generate();
    }
    add_point(tile) {
        this.tiles.push(tile);
        if (this.tiles.length == 1) {
            this.generate();
        }
        else {
            this.gen_line(this.tiles[this.tiles.length - 2], tile);
            this.gen_circle(tile);
        }
    }
    check_to_remove(row, col) {
        if (this.tiles.length < 2)
            return false;
        const secondToLast = this.tiles[this.tiles.length - 2];
        if (row !== secondToLast.row || col !== secondToLast.col)
            return false;
        if (this.finished)
            return false;
        const last = this.get_last_tile();
        eraseMaps([last]);
        const circle = document.getElementById(last.toString());
        const line = document.getElementById(secondToLast.toString() + "_" + last.toString());
        circle === null || circle === void 0 ? void 0 : circle.remove();
        line === null || line === void 0 ? void 0 : line.remove();
        this.tiles.pop();
        return true;
    }
    get_last_tile() {
        return this.tiles[this.tiles.length - 1];
    }
    finish(tile) {
        this.add_point(tile);
        this.finished = true;
        const lastCircle = this.group.querySelector(`#${this.tiles[this.tiles.length - 1].toString()}`);
        if (lastCircle) {
            lastCircle.setAttribute('r', ((this.width * 3) / 2).toString());
        }
        const startingCircle = this.group.querySelector(`#${this.tiles[0].toString()}`);
        if (startingCircle) {
            const animations = startingCircle.querySelectorAll('animate');
            animations.forEach(anim => anim.remove());
        }
        this.group.setAttribute('opacity', '1');
        fetch('/create_path', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: this.tiles.map(t => ({ row: t.row, col: t.col })), subboard: getBoardId() })
        })
            .then(response => {
            if (!response.ok) {
                throw new Error("Failed to submit path");
            }
            return response.json();
        })
            .then(data => {
            console.log("Path submitted:", data);
        })
            .catch(err => {
            console.error("Error submitting path:", err);
        });
    }
    delete() {
        this.group.remove();
        if (!this.finished) {
            resetCurrPath();
            return;
        }
        eraseMaps(this.tiles);
        fetch('/delete_path', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start: [this.tiles[0].row, this.tiles[0].col], end: [this.get_last_tile().row, this.get_last_tile().col], subboard: getBoardId() })
        })
            .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete path");
            }
            return response.json();
        })
            .then(data => {
            console.log("Path deleted:", data);
        })
            .catch(err => {
            console.error("Error deleting path:", err);
        });
    }
}
//# sourceMappingURL=path.js.map