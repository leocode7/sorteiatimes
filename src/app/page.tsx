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
      <header className="page-header">
        <h1>Baba do Ginásio de Esportes</h1>
        <p>Adicione os atletas e sorteie times com 5 jogadores.</p>
      </header>

      <section className="content-grid" aria-label="Organizador de times">
        <div className="panel roster-panel">
          <div className="panel-heading">
            <h2>Atletas</h2>
            <span className="count-badge">{players.length}</span>
          </div>

          <form className="add-form" onSubmit={addPlayer}>
            <label className="sr-only" htmlFor="player-name">Nome do atleta</label>
            <input id="player-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite o nome do atleta" autoComplete="off" />
            <button className="add-button" type="submit" disabled={!name.trim()} aria-label="Adicionar atleta">+</button>
          </form>
          <div className="roster-list" aria-live="polite">
            {players.length === 0 ? (
              <div className="empty-roster">Nenhum atleta adicionado.</div>
            ) : players.map((player, index) => (
              <div className="roster-row" key={`${player}-${index}`}>
                <span className="roster-name">{player}</span>
                <button className="remove-button" onClick={() => removePlayer(index)} aria-label={`Remover ${player}`} title="Remover atleta">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="right-column">
          <div className="panel draw-panel">
            <h2>Sorteio</h2>
            <p className="draw-description">Times com 5 atletas cada.</p>
            <button className="draw-button" onClick={drawTeams} disabled={!canDraw}>
              {teams.length ? "Sortear novamente" : "Sortear times"}
            </button>
            <p className="draw-hint">{!canDraw ? `Adicione mais ${5 - players.length} ${5 - players.length === 1 ? "atleta" : "atletas"} para sortear.` : remaining ? `${remaining} ${remaining === 1 ? "atleta ficará" : "atletas ficarão"} na reserva.` : "Todos serão sorteados."}</p>
          </div>

          {teams.length > 0 && (
            <div className="results-panel" aria-live="polite">
              <div className="results-heading"><h2>Times sorteados</h2></div>
              <div className="teams-grid">{teams.map((team, index) => (
                <article className={`team-card team-${index % 4}`} key={team.name}>
                  <div className="team-heading"><span className="team-name">{team.name}</span><span className="team-size">05 JOGADORES</span></div>
                  <ol>{team.players.map((player, playerIndex) => <li key={`${player}-${playerIndex}`}><span>{String(playerIndex + 1).padStart(2, "0")}</span>{player}</li>)}</ol>
                </article>
              ))}</div>
              {bench.length > 0 && <div className="bench-note"><p><strong>Na reserva:</strong> {bench.join(", ")}</p></div>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
