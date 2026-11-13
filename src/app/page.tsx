"use client";

import { FormEvent, useState } from "react";

type Team = { name: string; players: string[] };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export default function Home() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [bench, setBench] = useState<string[]>([]);

  function addPlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setPlayers((current) => [...current, trimmedName]);
    setName("");
    setTeams([]);
    setBench([]);
  }

  function drawTeams() {
    const shuffled = shuffle(players);
    const teamCount = Math.floor(shuffled.length / 5);
    setTeams(Array.from({ length: teamCount }, (_, index) => ({
      name: `Time ${String.fromCharCode(65 + index)}`,
      players: shuffled.slice(index * 5, index * 5 + 5),
    })));
    setBench(shuffled.slice(teamCount * 5));
  }

  function removePlayer(indexToRemove: number) {
    setPlayers((current) => current.filter((_, index) => index !== indexToRemove));
    setTeams([]);
    setBench([]);
  }

  const canDraw = players.length >= 5;
  const remaining = players.length % 5;

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Baba, início">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>baba do Ginásio<span className="brand-period">.</span></span>
        </a>
        <span className="topbar-note"><span className="live-dot" /> dia de jogo</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ORGANIZAÇÃO SOCIETY</p>
          <h1>Chegou, entrou.<br /><span>Deixa o baba</span> organizar.</h1>
          <p className="hero-description">Adicione quem chegou e deixe o sorteio montar os times. Sem discussão, só futebol.</p>
        </div>
        <div className="ball-art" aria-hidden="true"><span>⚽</span><i /><i /><i /></div>
      </section>

      <section className="content-grid" aria-label="Organizador de times">
        <div className="panel roster-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">01 / CHEGADA</p>
              <h2>Quem já chegou?</h2>
            </div>
            <span className="count-badge">{players.length} {players.length === 1 ? "atleta" : "atletas"}</span>
          </div>

          <form className="add-form" onSubmit={addPlayer}>
            <label className="sr-only" htmlFor="player-name">Nome do atleta</label>
            <input id="player-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite o nome do atleta" autoComplete="off" />
            <button className="add-button" type="submit" disabled={!name.trim()} aria-label="Adicionar atleta">+</button>
          </form>
          <p className="input-hint">Pressione Enter ou toque no + para adicionar</p>

          <div className="roster-list" aria-live="polite">
            {players.length === 0 ? (
              <div className="empty-roster"><span className="empty-icon">＋</span><p>A lista começa com você.</p><span>Adicione os atletas conforme forem chegando.</span></div>
            ) : players.map((player, index) => (
              <div className="roster-row" key={`${player}-${index}`}>
                <span className="arrival-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="player-avatar">{player.charAt(0).toUpperCase()}</span>
                <span className="roster-name">{player}</span>
                <button className="remove-button" onClick={() => removePlayer(index)} aria-label={`Remover ${player}`} title="Remover atleta">×</button>
              </div>
            ))}
          </div>

          <div className="roster-footer"><span className="roster-dot" /> ordem de chegada</div>
        </div>

        <div className="right-column">
          <div className="panel draw-panel">
            <p className="section-label">02 / SORTEIO</p>
            <h2>Hora de dividir<br />a galera.</h2>
            <p className="draw-description">Cada time sai com 5 atletas, escolhidos no aleatório.</p>
            <div className="draw-meta"><span>⚽</span><span>5 por time</span><span className="meta-divider" /><span>{players.length} na lista</span></div>
            <button className="draw-button" onClick={drawTeams} disabled={!canDraw}>
              <span className="shuffle-icon">⤨</span>{teams.length ? "Sortear de novo" : "Sortear os times"}<span className="button-arrow">↗</span>
            </button>
            {!canDraw ? <p className="draw-hint">Faltam {5 - players.length} {5 - players.length === 1 ? "atleta" : "atletas"} para começar</p> : <p className="draw-hint">{remaining ? `${remaining} ${remaining === 1 ? "atleta fica" : "atletas ficam"} na reserva` : "Todo mundo entra em campo"}</p>}
          </div>

          {teams.length > 0 ? (
            <div className="results-panel" aria-live="polite">
              <div className="results-heading"><div><p className="section-label">03 / RESULTADO</p><h2>Times sorteados</h2></div><span className="result-spark">✳</span></div>
              <div className="teams-grid">{teams.map((team, index) => (
                <article className={`team-card team-${index % 4}`} key={team.name}>
                  <div className="team-heading"><span className="team-name">{team.name}</span><span className="team-size">05 JOGADORES</span></div>
                  <ol>{team.players.map((player, playerIndex) => <li key={`${player}-${playerIndex}`}><span>{String(playerIndex + 1).padStart(2, "0")}</span>{player}</li>)}</ol>
                </article>
              ))}</div>
              {bench.length > 0 && <div className="bench-note"><span>↻</span><p><strong>Na reserva:</strong> {bench.join(", ")}</p></div>}
            </div>
          ) : (
            <div className="tip-card"><span className="tip-icon">✳</span><p><strong>Dica de boleiro</strong><br />Com 10 atletas, você forma 2 times e o jogo já começa.</p></div>
          )}
        </div>
      </section>
      <footer className="page-footer"><span>Criado por leocode</span><span>⚽ &nbsp; BOM JOGO!</span></footer>
    </main>
  );
}
