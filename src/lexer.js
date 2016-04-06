/**
 * Copyright (C) 2014 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */

var T_HALT_COMPILER = 101,
  T_USE = 102,
  T_ENCAPSED_AND_WHITESPACE = 103,
  T_OBJECT_OPERATOR = 104,
  T_STRING = 105,
  T_DOLLAR_OPEN_CURLY_BRACES = 106,
  T_STRING_VARNAME = 107,
  T_CURLY_OPEN = 108,
  T_NUM_STRING = 109,
  T_ISSET = 110,
  T_EMPTY = 111,
  T_INCLUDE = 112,
  T_INCLUDE_ONCE = 113,
  T_EVAL = 114,
  T_REQUIRE = 115,
  T_REQUIRE_ONCE = 116,
  T_NAMESPACE = 117,
  T_NS_SEPARATOR = 118,
  T_AS = 119,
  T_IF = 120,
  T_ENDIF = 121,
  T_WHILE = 122,
  T_DO = 123,
  T_FOR = 124,
  T_SWITCH = 125,
  T_BREAK = 126,
  T_CONTINUE = 127,
  T_RETURN = 128,
  T_GLOBAL = 129,
  T_STATIC = 130,
  T_ECHO = 131,
  T_INLINE_HTML = 132,
  T_UNSET = 133,
  T_FOREACH = 134,
  T_DECLARE = 135,
  T_TRY = 136,
  T_THROW = 137,
  T_GOTO = 138,
  T_FINALLY = 139,
  T_CATCH = 140,
  T_ENDDECLARE = 141,
  T_LIST = 142,
  T_CLONE = 143,
  T_PLUS_EQUAL = 144,
  T_MINUS_EQUAL = 145,
  T_MUL_EQUAL = 146,
  T_DIV_EQUAL = 147,
  T_CONCAT_EQUAL = 148,
  T_MOD_EQUAL = 149,
  T_AND_EQUAL = 150,
  T_OR_EQUAL = 151,
  T_XOR_EQUAL = 152,
  T_SL_EQUAL = 153,
  T_SR_EQUAL = 154,
  T_INC = 155,
  T_DEC = 156,
  T_BOOLEAN_OR = 157,
  T_BOOLEAN_AND = 158,
  T_LOGICAL_OR = 159,
  T_LOGICAL_AND = 160,
  T_LOGICAL_XOR = 161,
  T_SL = 162,
  T_SR = 163,
  T_IS_IDENTICAL = 164,
  T_IS_NOT_IDENTICAL = 165,
  T_IS_EQUAL = 166,
  T_IS_NOT_EQUAL = 167,
  T_IS_SMALLER_OR_EQUAL = 168,
  T_IS_GREATER_OR_EQUAL = 169,
  T_INSTANCEOF = 170,
  T_INT_CAST = 171,
  T_DOUBLE_CAST = 172,
  T_STRING_CAST = 173,
  T_ARRAY_CAST = 174,
  T_OBJECT_CAST = 175,
  T_BOOL_CAST = 176,
  T_UNSET_CAST = 177,
  T_EXIT = 178,
  T_PRINT = 179,
  T_YIELD = 180,
  T_YIELD_FROM = 181,
  T_FUNCTION = 182,
  T_DOUBLE_ARROW = 183,
  T_DOUBLE_COLON = 184,
  T_ARRAY = 185,
  T_CALLABLE = 186,
  T_CLASS = 187,
  T_ABSTRACT = 188,
  T_TRAIT = 189,
  T_FINAL = 190,
  T_EXTENDS = 191,
  T_INTERFACE = 192,
  T_IMPLEMENTS = 193,
  T_VAR = 194,
  T_PUBLIC = 195,
  T_PROTECTED = 196,
  T_PRIVATE = 197,
  T_CONST = 198,
  T_NEW = 199,
  T_INSTEADOF = 200,
  T_ELSEIF = 201,
  T_ELSE = 202,
  T_ENDSWITCH = 203,
  T_CASE = 204,
  T_DEFAULT = 205,
  T_ENDFOR = 206,
  T_ENDFOREACH = 207,
  T_ENDWHILE = 208,
  T_CONSTANT_ENCAPSED_STRING = 209,
  T_LNUMBER = 210,
  T_DNUMBER = 211,
  T_LINE = 212,
  T_FILE = 213,
  T_DIR = 214,
  T_TRAIT_C = 215,
  T_METHOD_C = 216,
  T_FUNC_C = 217,
  T_NS_C = 218,
  T_START_HEREDOC = 219,
  T_END_HEREDOC = 220,
  T_CLASS_C = 221,
  T_VARIABLE = 222,
  T_OPEN_TAG = 223,
  T_OPEN_TAG_WITH_ECHO = 224,
  T_CLOSE_TAG = 225,
  T_WHITESPACE = 226,
  T_COMMENT = 227,
  T_DOC_COMMENT = 228,
  T_ELLIPSIS = 229,
  T_COALESCE = 230,
  T_POW = 231,
  T_POW_EQUAL = 232;

// DEFINE LONG SIZE
if (process.arch == 'x64') {
  var SIZEOF_LONG = 8;
  var MAX_LENGTH_OF_LONG = 20;
  var long_min_digits = "9223372036854775808";
} else {
  var SIZEOF_LONG = 4;
  var MAX_LENGTH_OF_LONG = 11;
  var long_min_digits = "2147483648";
}

// check if is a 
var IS_LABEL_START = function(c) {
  return (
    c >= 'a' && c <= 'z'
  ) || (
    c >= 'A' && c <= 'Z'
  ) || (
    c == '_' || c >= 0x7F
  );
};

// escapes chars
var scan_escape_string = function(str) {
  return str;
};

// consume the specified length on the lexer
var consume = function(lexer, size) {
  if (size < 1) return false;
  var ch, i;
  // counting lines
  for(i = 0; i < size; i++) {
    ch = lexer._input[i];
    if (ch == '\n' || ch == '\r') {
      lexer.yylineno++;
      lexer.yylloc.last_line++;
      lexer.yylloc.last_column = 0;
      if (ch == '\r' && lexer._input[++i] == '\n') continue; // windows style
    } else {
      lexer.yylloc.last_column++;
    }
  }
  // update offsets
  if (lexer.options.ranges) lexer.yylloc.range[1] += size;
  lexer.yyleng += size;
  lexer.offset += size;
  // update texts
  ch = lexer._input.substring(0, size);
  lexer.yytext += ch;
  lexer.match += ch;
  lexer.matched += ch;
  lexer._input = lexer._input.slice(size);
  return ch;
};

/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true,"moduleName":"lexer","moduleType":"js"},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
  if (this.asp_tags) {
    this.begin("ST_IN_SCRIPTING");
    return T_OPEN_TAG_WITH_ECHO;
  } else {
    this.reject();
  }

break;
case 1:
  this.begin("ST_IN_SCRIPTING");
  return T_OPEN_TAG_WITH_ECHO;

break;
case 2:
  if (this.asp_tags) {
    this.begin("ST_IN_SCRIPTING");
    return T_OPEN_TAG;
  } else {
    this.reject();
  }

break;
case 3:
  this.begin("ST_IN_SCRIPTING");
  return T_OPEN_TAG;

break;
case 4:
  if (this.short_tags) {
    this.begin("ST_IN_SCRIPTING");
    return T_OPEN_TAG;
  } else {
    throw new Error('Unauth state');
    this.unput("<?");
  }

break;
case 5:
  var eot = this._input.length;
  var i = 0;
  var char;
  while(i < eot) {
    char = this._input[i];
    if (char == '<') {
      char = ++i < eot && this._input[i];
      if (char == '?') {
        if (
          this._input[i+1] == '='
          || this._input.substring(i + 1, i + 4) == 'php'
        ) {
          i --;
          break;
        }
      } else if(this.asp_tags && char == '%') {
        i --;
        break;
      }
    }
    i++;
  }
  consume(this, i);
  return T_INLINE_HTML;

break;
case 6:
  this.popState();
  return T_CLOSE_TAG;

break;
case 7:
  if (this.asp_tags) {
    this.popState();
    return T_CLOSE_TAG;  /* implicit ';' at php-end tag */
  } else {
    this.less(1);
    return yy_.yytext;
  }

break;
case 8:
  this.begin('ST_LOOKING_FOR_VARNAME');
  return T_DOLLAR_OPEN_CURLY_BRACES;

break;
case 9:
  this.less(yy_.yyleng-3);
  this.begin('ST_LOOKING_FOR_PROPERTY');
  return T_VARIABLE;

break;
case 10:
  this.less(yy_.yyleng - 1);
  this.pushState('ST_VAR_OFFSET');
  return T_VARIABLE;

break;
case 11:
  return T_VARIABLE;

break;
case 12:
  var eot = this._input.length;
  var i = 0;
  var char;
  while(i < eot) {
    char = this._input[i];
    if (char == '\\') {
      i++;
    } else if (char == '\'') {
      break;
    }
    i++;
  }
  consume(this, i + 1);
  return T_CONSTANT_ENCAPSED_STRING;

break;
case 13:
  var eot = this._input.length;
  var i = 0;
  var char;
  while(i < eot) {
    char = this._input[i];
    if (char == '\\') {
      i++;
    } else if (char == '"') {
      break;
    } else if (char == '$') {
      char = ++i < eot && this._input[i];
      i--;
      if ( char == '{' || IS_LABEL_START(char)) {
        break;
      }
    } else if (char == '{') {
      char = ++i < eot && this._input[i];
      i --;
      if (char == '$') {
        break;
      }
    }
    i++;
  }
  if (char == '"') {
    consume(this, i + 1);
    return T_CONSTANT_ENCAPSED_STRING;
  } else {
    this.begin("ST_DOUBLE_QUOTES");
    return '"';
  }

break;
case 14:
  this.heredoc_label = this.matches[2];
  if (this.heredoc_label[0] == '\'') {
    this.begin('ST_NOWDOC');
    this.heredoc_label = this.heredoc_label.substring(1, this.heredoc_label.length - 1);
  } else {
    if (this.heredoc_label[0] == '"') {
      this.heredoc_label = this.heredoc_label.substring(1, this.heredoc_label.length - 1);
    }
    this.begin('ST_HEREDOC');
  }
  return T_START_HEREDOC;

break;
case 15:
  this.begin("ST_BACKQUOTE");
  return '`';

break;
case 16:
  this.popState();
  this.popState();
  consume(this, this.heredoc_label.length - 1);
  return T_END_HEREDOC;

break;
case 17:
  this.less(1);
  this.begin('ST_IN_SCRIPTING');
  return T_CURLY_OPEN;

break;
case 18:
  this.popState();
  return '"';

break;
case 19:
  this.popState();
  return '`';

break;
case 20:
  var eot = this._input.length;
  var i = 0;
  var char;
  if (yy_.yytext == '\\') i++;
  while(i < eot) {
    char = this._input[i];
    if (char == '\\') {
      i++;
    } else if (char == '"') {
      i--; // exclude "
      break;
    } else if (char == '$') {
      char = ++i < eot && this._input[i];
      if ( char == '{' || IS_LABEL_START(char)) {
        i -= 2;
        break;
      } else continue;
    } else if (char == '{') {
      char = ++i < eot && this._input[i];
      if (char == '$') {
        i -= 2;
        break;
      } else continue;
    }
    i++;
  }
  consume(this, i + 1);
  return T_ENCAPSED_AND_WHITESPACE;

break;
case 21:
  if (yy_.yytext == '\\') this.input();
  while(this._input.length > 0) {
    var char = this.input();
    if (char == '\\') {
      this.input();
    } else if ( char == '$' ) {
      if (
        this._input[0] == '{'
        || IS_LABEL_START(c)
      ) {
        this.unput(char);
        break;
      }
    } else if (char == '`') {
      this.unput(char);
      break;
    }
  }
  // yy_.yytext = scan_escape_string(yy_.yytext);
  return T_ENCAPSED_AND_WHITESPACE;

break;
case 22:
  var eot = this._input.length;
  var i = 0, eol;
  var char;
  var lblLen = this.heredoc_label.length;
  var found = false;
  if (yy_.yytext == '\\') i++;
  while(i < eot) {
    char = this._input[i];
    if (char == '\n' || char == '\r') {
      if (char == '\r') {
        char = ++i < eot && this._input[i];
        if (char !== '\n') {
          i--;
        }
      }
      // @fixme : check if out of text limits
      if (this._input.substring(i + 1, i + lblLen + 1) == this.heredoc_label) {
        eol = this._input[ i + lblLen + 1];
        if ( eol == '\n' || eol == '\r' || eol == ';') {
          found = true;
          break;
        }
      }
    }
    else if (char === '\\') {
      char = ++i < eot && this._input[i];
      if (char == '\n' || char == '\r') {
        i--;
        
      }
    }
    else if (char == '$') {
      char = ++i < eot && this._input[i];
      if (char == '{' || IS_LABEL_START(char)) {
        i -= 2;
        break;
      }  else continue;
    }
    else if (char == '{') {
      char = ++i < eot && this._input[i];
      if (char == '$') {
        i -= 2;
        break;
      } else continue;
    }
    i++;
  }
  consume(this, i + 1);
  if (found) this.begin('ST_END_HEREDOC');
  return T_ENCAPSED_AND_WHITESPACE;

break;
case 23:
  var eot = this._input.length;
  var i = 0, eol;
  var char;
  var lblLen = this.heredoc_label.length;
  while(i < eot) {
    char = this._input[i];
    if (char == '\n' || char == '\r') {
      if (char == '\r') {
        char = ++i < eot && this._input[i];
        if (char !== '\n') i--;
      }
      // @fixme : check if out of text limits
      if (this._input.substring(i + 1, i + lblLen + 1) == this.heredoc_label) {
        eol = this._input[ i + lblLen + 1];
        if ( eol == '\n' || eol == '\r' || eol == ';') {
          break;
        }
      }
    }
    i++;
  }
  consume(this, i + 1);
  this.begin('ST_END_HEREDOC');
  return T_ENCAPSED_AND_WHITESPACE;

break;
case 24:
	return T_EXIT;

break;
case 25:
	return T_EXIT;

break;
case 26:
	return T_FUNCTION;

break;
case 27:
	return T_CONST;

break;
case 28:
	return T_RETURN;

break;
case 29:
	return T_YIELD_FROM;

break;
case 30:
	return T_YIELD;

break;
case 31:
	return T_TRY;

break;
case 32:
	return T_CATCH;

break;
case 33:
	return T_FINALLY;

break;
case 34:
	return T_THROW;

break;
case 35:
	return T_IF;

break;
case 36:
	return T_ELSEIF;

break;
case 37:
	return T_ENDIF;

break;
case 38:
	return T_ELSE;

break;
case 39:
	return T_WHILE;

break;
case 40:
	return T_ENDWHILE;

break;
case 41:
	return T_DO;

break;
case 42:
	return T_FOR;

break;
case 43:
	return T_ENDFOR;

break;
case 44:
	return T_FOREACH;

break;
case 45:
	return T_ENDFOREACH;

break;
case 46:
	return T_DECLARE;

break;
case 47:
  return T_ENDDECLARE;

break;
case 48:
  return T_INSTANCEOF;

break;
case 49:
  return T_AS;

break;
case 50:
	return T_SWITCH;

break;
case 51:
	return T_ENDSWITCH;

break;
case 52:
	return T_CASE;

break;
case 53:
	return T_DEFAULT;

break;
case 54:
	return T_BREAK;

break;
case 55:
	return T_CONTINUE;

break;
case 56:
	return T_GOTO;

break;
case 57:
	return T_ECHO;

break;
case 58:
	return T_PRINT;

break;
case 59:
	return T_CLASS;

break;
case 60:
	return T_INTERFACE;

break;
case 61:
	return T_TRAIT;

break;
case 62:
	return T_EXTENDS;

break;
case 63:
	return T_IMPLEMENTS;

break;
case 64:
  this.begin('ST_LOOKING_FOR_PROPERTY');
  return T_OBJECT_OPERATOR;

break;
case 65:
  return T_WHITESPACE;

break;
case 66:
	return T_OBJECT_OPERATOR;

break;
case 67:
  return T_STRING;

break;
case 68:
  this.popState();
  this.less(0);
  return false;

break;
case 69:
  return T_DOUBLE_COLON;

break;
case 70:
	return T_NS_SEPARATOR;

break;
case 71:
	return T_NEW;

break;
case 72:
	return T_CLONE;

break;
case 73:
	return T_VAR;

break;
case 74:
	return T_INT_CAST;

break;
case 75:
	return T_DOUBLE_CAST;

break;
case 76:
	return T_STRING_CAST;

break;
case 77:
	return T_ARRAY_CAST;

break;
case 78:
	return T_OBJECT_CAST;

break;
case 79:
	return T_BOOL_CAST;

break;
case 80:
	return T_UNSET_CAST;

break;
case 81:
	return T_EVAL;

break;
case 82:
	return T_INCLUDE;

break;
case 83:
	return T_INCLUDE_ONCE;

break;
case 84:
	return T_REQUIRE;

break;
case 85:
	return T_REQUIRE_ONCE;

break;
case 86:
	return T_NAMESPACE;

break;
case 87:
	return T_USE;

break;
case 88:
        return T_INSTEADOF;

break;
case 89:
	return T_GLOBAL;

break;
case 90:
	return T_ISSET;

break;
case 91:
	return T_EMPTY;

break;
case 92:
	return T_HALT_COMPILER;

break;
case 93:
	return T_STATIC;

break;
case 94:
	return T_ABSTRACT;

break;
case 95:
	return T_FINAL;

break;
case 96:
	return T_PRIVATE;

break;
case 97:
	return T_PROTECTED;

break;
case 98:
	return T_PUBLIC;

break;
case 99:
	return T_UNSET;

break;
case 100:
	return T_DOUBLE_ARROW;

break;
case 101:
	return T_LIST;

break;
case 102:
	return T_ARRAY;

break;
case 103:
 return T_CALLABLE;

break;
case 104:
	return T_INC;

break;
case 105:
	return T_DEC;

break;
case 106:
	return T_IS_IDENTICAL;

break;
case 107:
	return T_IS_NOT_IDENTICAL;

break;
case 108:
	return T_IS_EQUAL;

break;
case 109:
	return T_IS_NOT_EQUAL;

break;
case 110:
	return T_IS_SMALLER_OR_EQUAL;

break;
case 111:
	return T_IS_GREATER_OR_EQUAL;

break;
case 112:
	return T_PLUS_EQUAL;

break;
case 113:
	return T_MINUS_EQUAL;

break;
case 114:
	return T_MUL_EQUAL;

break;
case 115:
	return T_DIV_EQUAL;

break;
case 116:
	return T_CONCAT_EQUAL;

break;
case 117:
	return T_MOD_EQUAL;

break;
case 118:
	return T_SL_EQUAL;

break;
case 119:
	return T_SR_EQUAL;

break;
case 120:
	return T_AND_EQUAL;

break;
case 121:
	return T_OR_EQUAL;

break;
case 122:
	return T_XOR_EQUAL;

break;
case 123:
	return T_BOOLEAN_OR;

break;
case 124:
	return T_BOOLEAN_AND;

break;
case 125:
	return T_LOGICAL_OR;

break;
case 126:
	return T_LOGICAL_AND;

break;
case 127:
	return T_LOGICAL_XOR;

break;
case 128:
	return T_SL;

break;
case 129:
	return T_SR;

break;
case 130:
	return T_ELLIPSIS;

break;
case 131:
	return T_COALESCE;

break;
case 132:
	return T_POW_EQUAL;

break;
case 133:
	return T_POW;

break;
case 134:
	return '{';

break;
case 135:
  // @todo : RESET_DOC_COMMENT();
  if (
    this.conditionStack.length > 2
    && this.conditionStack[this.conditionStack.length - 2] !== 'ST_IN_SCRIPTING'
  ) {
    this.popState();
  }
  return '}';

break;
case 136:
	return T_CLASS_C;

break;
case 137:
	return T_TRAIT_C;

break;
case 138:
	return T_FUNC_C;

break;
case 139:
	return T_METHOD_C;

break;
case 140:
	return T_LINE;

break;
case 141:
	return T_FILE;

break;
case 142:
	return T_DIR;

break;
case 143:
	return T_NS_C;

break;
case 144:
  this.less(yy_.yyleng - 1);
  this.popState(); 
  this.begin('ST_IN_SCRIPTING');
  return T_STRING_VARNAME;

break;
case 145:
  this.popState(); 
  this.less(0);
  return false;

break;
case 146: /* Offset could be treated as a long */
	return T_NUM_STRING;

break;
case 147: /* Offset must be treated as a string */
	return T_NUM_STRING;

break;
case 148:
  this.popState();
  return ']';

break;
case 149:
	return yy_.yytext;

break;
case 150:
  return T_ENCAPSED_AND_WHITESPACE;

break;
case 151:
	return T_STRING;

break;
case 152:
  return T_DNUMBER;

break;
case 153:
  return T_LNUMBER;

break;
case 154:
		return T_LNUMBER;

break;
case 155:
  if (yy_.yyleng < MAX_LENGTH_OF_LONG - 1) {
    return T_LNUMBER;
  } else {
    if (
      yy_.yyleng == MAX_LENGTH_OF_LONG 
      && yy_.yytext < long_min_digits 
    ) {
      return T_LNUMBER;
    }
    return T_DNUMBER;
  }

break;
case 156:
  while(this._input.length > 0) {
    var char = this.input();
    if (
      char == '\r'
      || char == '\n'
      || char == '\r\n'
    ) {
      break;
    } else if (
      char == '?'
      && this._input[0] == '>'
    ) {
      // end of PHP tag
      this.unput(char);
      break;
    } else if (
      this.asp_tags
      && char == '%'
      && this._input[0] == '>'
    ) {
      // end of PHP(ASP-Like) tag
      this.unput(char);
      break;
    }
  }
  return T_COMMENT;

break;
case 157:
  var type = T_COMMENT;
  if (yy_.yytext.length > 2) {
    type = T_DOC_COMMENT;
  }
  while(this._input.length > 0) {
    var char = this.input();
    if (
      char == '*'
      && this._input[0] == '/'
    ) {
      this.input();
      break;
    }
  }
  return type;

break;
case 158:
	return yy_.yytext;

break;
case 159:
  this.reject();

break;
}
},
rules: [/^(?:<%=)/i,/^(?:<\?=)/i,/^(?:<%)/i,/^(?:<\?php([ \t]|((\r\n|\n|\r))))/i,/^(?:<\?)/i,/^(?:([^]))/i,/^(?:\?>((\r\n|\n|\r))?)/i,/^(?:%>((\r\n|\n|\r))?)/i,/^(?:\$\{)/i,/^(?:\$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)->[a-zA-Z_\x7f-\xff])/i,/^(?:\$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)\[)/i,/^(?:\$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*))/i,/^(?:b?['])/i,/^(?:b?["])/i,/^(?:b?<<<([ \t]*)(([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)|([']([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)['])|(["]([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)["]))((\r\n|\n|\r)))/i,/^(?:[`])/i,/^(?:([^]))/i,/^(?:\{\$)/i,/^(?:["])/i,/^(?:[`])/i,/^(?:([^]))/i,/^(?:([^]))/i,/^(?:([^]))/i,/^(?:([^]))/i,/^(?:exit\b)/i,/^(?:die\b)/i,/^(?:function\b)/i,/^(?:const\b)/i,/^(?:return\b)/i,/^(?:yield from\b)/i,/^(?:yield\b)/i,/^(?:try\b)/i,/^(?:catch\b)/i,/^(?:finally\b)/i,/^(?:throw\b)/i,/^(?:if\b)/i,/^(?:elseif\b)/i,/^(?:endif\b)/i,/^(?:else\b)/i,/^(?:while\b)/i,/^(?:endwhile\b)/i,/^(?:do\b)/i,/^(?:for\b)/i,/^(?:endfor\b)/i,/^(?:foreach\b)/i,/^(?:endforeach\b)/i,/^(?:declare\b)/i,/^(?:enddeclare\b)/i,/^(?:instanceof\b)/i,/^(?:as\b)/i,/^(?:switch\b)/i,/^(?:endswitch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:goto\b)/i,/^(?:echo\b)/i,/^(?:print\b)/i,/^(?:class\b)/i,/^(?:interface\b)/i,/^(?:trait\b)/i,/^(?:extends\b)/i,/^(?:implements\b)/i,/^(?:->)/i,/^(?:([ \n\r\t]+)+)/i,/^(?:->)/i,/^(?:([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*))/i,/^(?:([^]))/i,/^(?:::)/i,/^(?:\\)/i,/^(?:new\b)/i,/^(?:clone\b)/i,/^(?:var\b)/i,/^(?:\(([ \t]*)(int|integer)([ \t]*)\))/i,/^(?:\(([ \t]*)(real|double|float)([ \t]*)\))/i,/^(?:\(([ \t]*)(string|binary)([ \t]*)\))/i,/^(?:\(([ \t]*)array([ \t]*)\))/i,/^(?:\(([ \t]*)object([ \t]*)\))/i,/^(?:\(([ \t]*)(bool|boolean)([ \t]*)\))/i,/^(?:\(([ \t]*)(unset)([ \t]*)\))/i,/^(?:eval\b)/i,/^(?:include\b)/i,/^(?:include_once\b)/i,/^(?:require\b)/i,/^(?:require_once\b)/i,/^(?:namespace\b)/i,/^(?:use\b)/i,/^(?:insteadof\b)/i,/^(?:global\b)/i,/^(?:isset\b)/i,/^(?:empty\b)/i,/^(?:__halt_compiler\b)/i,/^(?:static\b)/i,/^(?:abstract\b)/i,/^(?:final\b)/i,/^(?:private\b)/i,/^(?:protected\b)/i,/^(?:public\b)/i,/^(?:unset\b)/i,/^(?:=>)/i,/^(?:list\b)/i,/^(?:array\b)/i,/^(?:callable\b)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:===)/i,/^(?:!==)/i,/^(?:==)/i,/^(?:!=|<>)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:\+=)/i,/^(?:-=)/i,/^(?:\*=)/i,/^(?:\/=)/i,/^(?:\.=)/i,/^(?:%=)/i,/^(?:<<=)/i,/^(?:>>=)/i,/^(?:&=)/i,/^(?:\|=)/i,/^(?:\^=)/i,/^(?:\|\|)/i,/^(?:&&)/i,/^(?:OR\b)/i,/^(?:AND\b)/i,/^(?:XOR\b)/i,/^(?:<<)/i,/^(?:>>)/i,/^(?:\.\.\.)/i,/^(?:\?\?)/i,/^(?:\*\*=)/i,/^(?:\*\*)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:__CLASS__\b)/i,/^(?:__TRAIT__\b)/i,/^(?:__FUNCTION__\b)/i,/^(?:__METHOD__\b)/i,/^(?:__LINE__\b)/i,/^(?:__FILE__\b)/i,/^(?:__DIR__\b)/i,/^(?:__NAMESPACE__\b)/i,/^(?:([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)[[}])/i,/^(?:([^]))/i,/^(?:[0]|([1-9][0-9]*))/i,/^(?:([0-9]+)|(0x[0-9a-fA-F]+)|(0b[01]+))/i,/^(?:\])/i,/^(?:([;:,.\[\]()|^&+-\/*=%!~$<>?@])|[{}"`])/i,/^(?:[ \n\r\t\\'#])/i,/^(?:([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*))/i,/^(?:(((([0-9]+)|(([0-9]*\.[0-9]+)|([0-9]+\.[0-9]*)))[eE][+-]?([0-9]+)))|(([0-9]*\.[0-9]+)|([0-9]+\.[0-9]*)))/i,/^(?:(0b[01]+))/i,/^(?:(0x[0-9a-fA-F]+))/i,/^(?:([0-9]+))/i,/^(?:#|\/\/)/i,/^(?:\/\*\*([ \n\r\t]+)|\/\*)/i,/^(?:([;:,.\[\]()|^&+-\/*=%!~$<>?@]))/i,/^(?:([^]))/i],
conditions: {"ST_LOOKING_FOR_VARNAME":{"rules":[144,145],"inclusive":false},"ST_NOWDOC":{"rules":[23],"inclusive":false},"ST_END_HEREDOC":{"rules":[16],"inclusive":false},"ST_HEREDOC":{"rules":[8,9,10,11,17,22],"inclusive":false},"ST_BACKQUOTE":{"rules":[8,9,10,11,17,19,21],"inclusive":false},"ST_DOUBLE_QUOTES":{"rules":[8,9,10,11,17,18,20],"inclusive":false},"ST_LOOKING_FOR_PROPERTY":{"rules":[66,67,68],"inclusive":false},"ST_VAR_OFFSET":{"rules":[11,146,147,148,149,150,151,159],"inclusive":false},"ST_IN_SCRIPTING":{"rules":[6,7,11,12,13,14,15,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,151,152,153,154,155,156,157,158,159],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5],"inclusive":true}}
});
return lexer;
})();


// defines if all tokens must be retrieved (used by token_get_all only)
lexer.all_tokens = true;
// enables the evald mode (ignore opening tags)
lexer.mode_eval = false;
// disables by default asp tags mode
lexer.asp_tags = false;
// enables by default short tags mode
lexer.short_tags = true;
// change lexer algorithm
var lex = lexer.lex;
lexer.lex = function() {
  var token = lex.call(this);
  if (!this.all_tokens) {
    while(
      token === T_WHITESPACE      // ignore white space
      || token === T_COMMENT      // ignore single lines comments
      || token === T_DOC_COMMENT  // ignore doc comments
      || (
        !this.mode_eval // ignore open/close tags
        && (
          token === T_OPEN_TAG
        )
      )
    ) {
      token = lex.call(this);
    }
    if (!this.mode_eval && token == T_OPEN_TAG_WITH_ECHO) {
      // open tag with echo statement
      return T_ECHO; 
    }
  }
  return token;
};

// fix of input algorithm @see https://github.com/zaach/jison-lex/pull/10
lexer.input = function() {
  var ch = this._input[0];
  if ( ch == '\r' && this._input[1] == '\n' ) {
      ch += '\n'; 
      this.yyleng++;
      this.offset++;
      this._input = this._input.slice(1);
      if (this.options.ranges) {
          this.yylloc.range[1]++;
      }
  }
  this.yytext += ch;
  this.yyleng++;
  this.offset++;
  this.match += ch;
  this.matched += ch;
  var lines = ch.match(/(?:\r\n?|\n).*/g);
  if (lines) {
      this.yylineno++;
      this.yylloc.last_line++;
  } else {
      this.yylloc.last_column++;
  }
  if (this.options.ranges) {
      this.yylloc.range[1]++;
  }

  this._input = this._input.slice(1);
  return ch;
};

// FORCE TO CHANGE THE INITIAL STATE IN EVAL MODE
var setInput = lexer.setInput;
lexer.setInput = function (input, yy) {
  setInput.call(this, input, yy);
  if (
    !this.all_tokens && this.mode_eval
  ) {
    this.conditionStack = ['ST_IN_SCRIPTING'];
  }
};

module.exports = lexer;