// vim: fdm=marker et ts=2 sw=2 tw=80 fo=tcqwn list

package com.debiki.v0

import net.liftweb.common.Box

/** Debiki's Data Access Object interface.
 */
abstract class Dao {

  def loadDebate(debateId: String,
                 tenantId: Option[String] = None): Box[Debate]

}
