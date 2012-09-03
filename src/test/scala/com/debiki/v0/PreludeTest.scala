// vim: ts=2 sw=2 et
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.debiki.v0

import org.specs._
import java.{util => ju}
import Prelude._


class PreludeTest extends SpecificationWithJUnit {

  "stripStartEndBlanks" should {
    "convert '' to ''" in { stripStartEndBlanks("") must_== "" }
    "convert ' ' to ''" in { stripStartEndBlanks(" ") must_== "" }
    "convert '\\r\\n' to ''" in { stripStartEndBlanks("\r\n") must_== "" }
    "convert 'x' to 'x'" in { stripStartEndBlanks("x") must_== "x" }
    "convert 'xyz' to 'xyz'" in { stripStartEndBlanks("xyz") must_== "xyz" }
    "convert '  xyz' to 'xyz'" in { stripStartEndBlanks("  xyz") must_== "xyz" }
    "convert 'xyz  ' to 'xyz'" in { stripStartEndBlanks("xyz  ") must_== "xyz" }
    "convert '  xyz  ' to 'xyz'" in {
       stripStartEndBlanks("  xyz  ") must_== "xyz" }
  }

  "nextRandomString" should {
    "be at least 5 chars and contain no vowels but `uy'" >> {
      for (i <- 1 to 50) {
        val s = nextRandomString
        // Vowels aoei forbidden, and only lowercase chars (+ numbers) allowed.
        ("aoeiABCDEFGHIJKLMNOPQRSTUVWXYZ" intersect s) must_== ""
        s.length must be_>=(5)
      }
    }
  }

  "drowRightWhile" should {
    "work" >> {
      "".dropRightWhile((_) => true) must_== ""
      "".dropRightWhile((_) => false) must_== ""
      "a".dropRightWhile((_) => true) must_== ""
      "a".dropRightWhile((_) => false) must_== "a"
      "abc".dropRightWhile((_) => true) must_== ""
      "abc".dropRightWhile((_) => false) must_== "abc"
      "abcde".dropRightWhile(_ != 'x') must_== ""
      "abcde".dropRightWhile(_ != 'a') must_== "a"
      "abcde".dropRightWhile(_ != 'b') must_== "ab"
      "abcde".dropRightWhile(_ != 'c') must_== "abc"
      "abcde".dropRightWhile(_ != 'd') must_== "abcd"
      "abcde".dropRightWhile(_ != 'e') must_== "abcde"
      // Many matching characters: (two '.')
      "some.package.ClassName".dropRightWhile(_ != '.') must_== "some.package."
    }
  }

  "takeRightWhile" should {
    "work even better" >> {
      "".takeRightWhile((_) => true) must_== ""
      "".takeRightWhile((_) => false) must_== ""
      "a".takeRightWhile((_) => true) must_== "a"
      "a".takeRightWhile((_) => false) must_== ""
      "abc".takeRightWhile((_) => true) must_== "abc"
      "abc".takeRightWhile((_) => false) must_== ""
      "abcde".takeRightWhile(_ != 'x') must_== "abcde"
      "abcde".takeRightWhile(_ != 'a') must_== "bcde"
      "abcde".takeRightWhile(_ != 'b') must_== "cde"
      "abcde".takeRightWhile(_ != 'c') must_== "de"
      "abcde".takeRightWhile(_ != 'd') must_== "e"
      "abcde".takeRightWhile(_ != 'e') must_== ""
      // Many matching characters: (two '.')
      "some.package.ClassName".takeRightWhile(_ != '.') must_== "ClassName"
    }
  }

  "ISO time functions" can {

    "write a date" >> {
      val datiStr: String = toIso8601T(new ju.Date(0))
      val datiStrNoT: String = toIso8601(new ju.Date(0))
      datiStr must_== "1970-01-01T00:00:00Z"
      datiStrNoT must_== "1970-01-01 00:00:00Z"
    }

    "parse a date" >> {
      val dati: ju.Date = parseIso8601DateTime("1970-01-01T00:00:00Z")
      dati must_== new ju.Date(0)
    }

    "parse a date string and write it back again" >> {
      val datiStr = "2012-01-02T10:20:30Z"
      val datiParsed = parseIso8601DateTime(datiStr)
      val datiStrAfter = toIso8601T(datiParsed)
      datiStr must_== datiStrAfter
    }
  }

}


