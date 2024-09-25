import { RepoProps } from "../types/repo";
import Repo from "../components/Repo";
import BackBtn from "../components/BackBtn";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from "./Repos.module.css";
import Loader from "../components/Loader";

const Repos = () => {
  const { username } = useParams();

  const [repos, setRepos] = useState<RepoProps[] | [] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadrepos = async (username: string) => {
      setIsLoading(true);

      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);

        if (!res.ok) {
          throw new Error("Failed to fetch repos");
        }

        const data = await res.json();

        // Filtrar os repositórios que você deseja
        const filteredRepos = data.filter((repo: RepoProps) =>
          ["BACK-END_FRONT-END", "FRONT-END", "PORTFOLIO-BERGKLEY"].includes(repo.name)
        );

        setRepos(filteredRepos);
      } catch (error) {
        console.error(error);
        setRepos([]); // Ou pode definir uma mensagem de erro
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadrepos(username);
    }
  }, [username]);

  if (!repos && isLoading) return <Loader />;

  return (
    <div className={classes.repos}>
      <BackBtn />
      <h2>Explore os repositórios do usuário: {username}</h2>
      {repos && repos.length === 0 && <p>Não há repositórios.</p>}
      {repos && repos.length > 0 && (
        <div className={classes.repos_container}>
          {repos.map((repo: RepoProps) => (
            <Repo key={repo.name} {...repo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Repos;
