/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable no-var */
/*
    Sudoku.js
    ---------

    A Sudoku puzzle generator and solver JavaScript library.

    Please see the README for more details.
*/

class Sudoku {
  constructor() {
    this.DIGITS = "123456789";
    this.BLANK_CHAR = ".";
    this.BLANK_BOARD =
      "...................................................." +
      ".............................";
    this.ROWS = "ABCDEFGHI";
    this.COLS = this.DIGITS;
    this.SQUARES = null;

    this.UNITS = null;
    this.SQUARE_UNITS_MAP = null;
    this.SQUARE_PEERS_MAP = null;

    this.MIN_GIVENS = 17;
    this.NR_SQUARES = 81;

    this.DIFFICULTY = {
      easy: 62,
      medium: 53,
      hard: 44,
      "very-hard": 35,
      insane: 26,
      inhuman: 17,
    };
  }

  initialize() {
    this.SQUARES = this._cross(this.ROWS, this.COLS);
    this.UNITS = this._get_all_units(this.ROWS, this.COLS);
    this.SQUARE_UNITS_MAP = this._get_square_units_map(this.SQUARES, this.UNITS);
    this.SQUARE_PEERS_MAP = this._get_square_peers_map(
      this.SQUARES,
      this.SQUARE_UNITS_MAP,
    );
  }

  generate(difficulty, unique) {
    this.initialize();

    if (typeof difficulty === "string" || typeof difficulty === "undefined") {
      difficulty = this.DIFFICULTY[difficulty] || this.DIFFICULTY.easy;
    }

    difficulty = this._force_range(difficulty, this.NR_SQUARES + 1, this.MIN_GIVENS);

    unique = unique || true;

    var blank_board = "";
    for (var i = 0; i < this.NR_SQUARES; ++i) {
      blank_board += ".";
    }
    var candidates = this._get_candidates_map(blank_board);

    var shuffled_squares = this._shuffle(this.SQUARES);
    for (var si in shuffled_squares) {
      var square = shuffled_squares[si];

      var rand_candidate_idx = this._rand_range(candidates[square].length);
      var rand_candidate = candidates[square][rand_candidate_idx];
      if (!this._assign(candidates, square, rand_candidate)) {
        break;
      }

      var single_candidates = [];
      for (var si in this.SQUARES) {
        var square = this.SQUARES[si];

        if (candidates[square].length == 1) {
          single_candidates.push(candidates[square]);
        }
      }

      if (
        single_candidates.length >= difficulty &&
        this._strip_dups(single_candidates).length >= 8
      ) {
        var board = "";
        var givens_idxs = [];
        for (var i in this.SQUARES) {
          var square = this.SQUARES[i];
          if (candidates[square].length == 1) {
            board += candidates[square];
            givens_idxs.push(i);
          } else {
            board += this.BLANK_CHAR;
          }
        }

        var nr_givens = givens_idxs.length;
        if (nr_givens > difficulty) {
          givens_idxs = this._shuffle(givens_idxs);
          for (var i = 0; i < nr_givens - difficulty; ++i) {
            var target = parseInt(givens_idxs[i]);
            board = board.substr(0, target) + this.BLANK_CHAR + board.substr(target + 1);
          }
        }

        if (this.solve(board)) {
          return board;
        }
      }
    }

    // Give up and try a new puzzle
    return this.generate(difficulty);
  }

  solve(board, reverse) {
    var report = this.validate_board(board);
    if (report !== true) {
      throw report;
    }

    var nr_givens = 0;
    for (var i in board) {
      if (board[i] !== this.BLANK_CHAR && this._in(board[i], this.DIGITS)) {
        ++nr_givens;
      }
    }
    if (nr_givens < this.MIN_GIVENS) {
      throw "Too few givens. Minimum givens is " + this.MIN_GIVENS;
    }

    reverse = reverse || false;

    var candidates = this._get_candidates_map(board);
    var result = this._search(candidates, reverse);

    if (result) {
      var solution = "";
      for (var square in result) {
        solution += result[square];
      }
      return solution;
    }
    return "";
  }

  get_candidates(board) {
    var report = this.validate_board(board);
    if (report !== true) {
      throw report;
    }

    var candidates_map = this._get_candidates_map(board);

    if (!candidates_map) {
      return false;
    }

    var rows = [];
    var cur_row = [];
    var i = 0;
    for (var square in candidates_map) {
      var candidates = candidates_map[square];
      cur_row.push(candidates);
      if (i % 9 == 8) {
        rows.push(cur_row);
        cur_row = [];
      }
      ++i;
    }
    return rows;
  }

  _get_candidates_map(board) {
    var report = this.validate_board(board);
    if (report !== true) {
      throw report;
    }

    var candidate_map = {};
    var squares_values_map = this._get_square_vals_map(board);

    for (var si in this.SQUARES) {
      candidate_map[this.SQUARES[si]] = this.DIGITS;
    }

    for (var square in squares_values_map) {
      var val = squares_values_map[square];

      if (this._in(val, this.DIGITS)) {
        var new_candidates = this._assign(candidate_map, square, val);
        if (!new_candidates) {
          return false;
        }
      }
    }

    return candidate_map;
  }

  _search(candidates, reverse) {
    if (!candidates) {
      return false;
    }

    reverse = reverse || false;

    var max_nr_candidates = 0;
    var max_candidates_square = null;
    for (var si in this.SQUARES) {
      var square = this.SQUARES[si];

      var nr_candidates = candidates[square].length;

      if (nr_candidates > max_nr_candidates) {
        max_nr_candidates = nr_candidates;
        max_candidates_square = square;
      }
    }
    if (max_nr_candidates === 1) {
      return candidates;
    }

    var min_nr_candidates = 10;
    var min_candidates_square = null;
    for (si in this.SQUARES) {
      var square = this.SQUARES[si];

      var nr_candidates = candidates[square].length;

      if (nr_candidates < min_nr_candidates && nr_candidates > 1) {
        min_nr_candidates = nr_candidates;
        min_candidates_square = square;
      }
    }

    var min_candidates = candidates[min_candidates_square];
    if (!reverse) {
      for (var vi in min_candidates) {
        var val = min_candidates[vi];

        var candidates_copy = JSON.parse(JSON.stringify(candidates));
        var candidates_next = this._search(
          this._assign(candidates_copy, min_candidates_square, val),
        );

        if (candidates_next) {
          return candidates_next;
        }
      }
    } else {
      for (var vi = min_candidates.length - 1; vi >= 0; --vi) {
        var val = min_candidates[vi];

        var candidates_copy = JSON.parse(JSON.stringify(candidates));
        var candidates_next = this._search(
          this._assign(candidates_copy, min_candidates_square, val),
          reverse,
        );

        if (candidates_next) {
          return candidates_next;
        }
      }
    }

    return false;
  }

  _assign(candidates, square, val) {
    var other_vals = candidates[square].replace(val, "");

    for (var ovi in other_vals) {
      var other_val = other_vals[ovi];

      var candidates_next = this._eliminate(candidates, square, other_val);

      if (!candidates_next) {
        return false;
      }
    }

    return candidates;
  }

  _eliminate(candidates, square, val) {
    if (!this._in(val, candidates[square])) {
      return candidates;
    }

    candidates[square] = candidates[square].replace(val, "");

    var nr_candidates = candidates[square].length;
    if (nr_candidates === 1) {
      var target_val = candidates[square];

      for (var pi in this.SQUARE_PEERS_MAP[square]) {
        var peer = this.SQUARE_PEERS_MAP[square][pi];

        var candidates_new = this._eliminate(candidates, peer, target_val);

        if (!candidates_new) {
          return false;
        }
      }
    }
    if (nr_candidates === 0) {
      return false;
    }

    for (var ui in this.SQUARE_UNITS_MAP[square]) {
      var unit = this.SQUARE_UNITS_MAP[square][ui];

      var val_places = [];
      for (var si in unit) {
        var unit_square = unit[si];
        if (this._in(val, candidates[unit_square])) {
          val_places.push(unit_square);
        }
      }

      if (val_places.length === 0) {
        return false;
      } else if (val_places.length === 1) {
        var candidates_new = this._assign(candidates, val_places[0], val);

        if (!candidates_new) {
          return false;
        }
      }
    }

    return candidates;
  }

  _get_square_vals_map(board) {
    var squares_vals_map = {};

    if (board.length != this.SQUARES.length) {
      throw "Board/squares length mismatch.";
    } else {
      for (var i in this.SQUARES) {
        squares_vals_map[this.SQUARES[i]] = board[i];
      }
    }

    return squares_vals_map;
  }

  _get_square_units_map(squares, units) {
    var square_unit_map = {};

    for (var si in squares) {
      var cur_square = squares[si];

      var cur_square_units = [];

      for (var ui in units) {
        var cur_unit = units[ui];

        if (cur_unit.indexOf(cur_square) !== -1) {
          cur_square_units.push(cur_unit);
        }
      }

      square_unit_map[cur_square] = cur_square_units;
    }

    return square_unit_map;
  }

  _get_square_peers_map(squares, units_map) {
    var square_peers_map = {};

    for (var si in squares) {
      var cur_square = squares[si];
      var cur_square_units = units_map[cur_square];
      var cur_square_peers = [];

      for (var sui in cur_square_units) {
        var cur_unit = cur_square_units[sui];

        for (var ui in cur_unit) {
          var cur_unit_square = cur_unit[ui];

          if (
            cur_square_peers.indexOf(cur_unit_square) === -1 &&
            cur_unit_square !== cur_square
          ) {
            cur_square_peers.push(cur_unit_square);
          }
        }
      }

      square_peers_map[cur_square] = cur_square_peers;
    }

    return square_peers_map;
  }

  _get_all_units(rows, cols) {
    var units = [];

    for (var ri in rows) {
      units.push(this._cross(rows[ri], cols));
    }

    for (var ci in cols) {
      units.push(this._cross(rows, cols[ci]));
    }

    var row_squares = ["ABC", "DEF", "GHI"];
    var col_squares = ["123", "456", "789"];
    for (var rsi in row_squares) {
      for (var csi in col_squares) {
        units.push(this._cross(row_squares[rsi], col_squares[csi]));
      }
    }

    return units;
  }

  board_string_to_grid(board_string) {
    var rows = [];
    var cur_row = [];
    for (var i in board_string) {
      cur_row.push(board_string[i]);
      if (i % 9 == 8) {
        rows.push(cur_row);
        cur_row = [];
      }
    }
    return rows;
  }

  board_grid_to_string(board_grid) {
    var board_string = "";
    for (var r = 0; r < 9; ++r) {
      for (var c = 0; c < 9; ++c) {
        board_string += board_grid[r][c];
      }
    }
    return board_string;
  }

  print_board(board) {
    var report = this.validate_board(board);
    if (report !== true) {
      throw report;
    }

    var V_PADDING = " ";
    var H_PADDING = "\n";

    var V_BOX_PADDING = "  ";
    var H_BOX_PADDING = "\n";

    var display_string = "";

    for (var i in board) {
      var square = board[i];

      display_string += square + V_PADDING;

      if (i % 3 === 2) {
        display_string += V_BOX_PADDING;
      }

      if (i % 9 === 8) {
        display_string += H_PADDING;
      }

      if (i % 27 === 26) {
        display_string += H_BOX_PADDING;
      }
    }
  }

  validate_board(board) {
    if (!board) {
      return "Empty board";
    }

    if (board.length !== this.NR_SQUARES) {
      return "Invalid board size. Board must be exactly " + this.NR_SQUARES + " squares.";
    }

    for (var i in board) {
      if (!this._in(board[i], this.DIGITS) && board[i] !== this.BLANK_CHAR) {
        return "Invalid board character encountered at index " + i + ": " + board[i];
      }
    }

    return true;
  }

  _cross(a, b) {
    var result = [];
    for (var ai in a) {
      for (var bi in b) {
        result.push(a[ai] + b[bi]);
      }
    }
    return result;
  }

  _in(v, seq) {
    return seq.indexOf(v) !== -1;
  }

  _first_true(seq) {
    for (var i in seq) {
      if (seq[i]) {
        return seq[i];
      }
    }
    return false;
  }

  _shuffle(seq) {
    var shuffled = [];
    for (var i = 0; i < seq.length; ++i) {
      shuffled.push(false);
    }

    for (var i in seq) {
      var ti = this._rand_range(seq.length);

      while (shuffled[ti]) {
        ti = ti + 1 > seq.length - 1 ? 0 : ti + 1;
      }

      shuffled[ti] = seq[i];
    }

    return shuffled;
  }

  _rand_range(max, min) {
    min = min || 0;
    if (max) {
      return Math.floor(Math.random() * (max - min)) + min;
    } else {
      throw "Range undefined";
    }
  }

  _strip_dups(seq) {
    var seq_set = [];
    var dup_map = {};
    for (var i in seq) {
      var e = seq[i];
      if (!dup_map[e]) {
        seq_set.push(e);
        dup_map[e] = true;
      }
    }
    return seq_set;
  }

  _force_range(nr, max, min) {
    min = min || 0;
    nr = nr || 0;
    if (nr < min) {
      return min;
    }
    if (nr > max) {
      return max;
    }
    return nr;
  }
}

export default Sudoku;
