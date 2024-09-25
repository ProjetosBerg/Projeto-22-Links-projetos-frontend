import { RepoProps } from "../types/repo";

import { AiOutlineStar, AiOutlineFork } from "react-icons/ai";
import { BsCodeSlash } from "react-icons/bs";
import { RiGitRepositoryLine } from "react-icons/ri";
import { FaFolderOpen } from 'react-icons/fa';


import classes from "./Repo.module.css";
import { Link } from "react-router-dom";
 


const Repo = ({
  name,
  language,
  html_url,
  forks_count,
  stargazers_count,
}: RepoProps) => {
  return (
    <div className={classes.repo}>
      <h3>{name}</h3>
      <p>
        <BsCodeSlash /> {language}
      </p>
      <div className={classes.stats}>
        <div>
          <AiOutlineStar />
          <span>{stargazers_count}</span>
        </div>
        <div>
          <AiOutlineFork />
          <span>{forks_count}</span>
        </div>
      </div>
      <div className={classes.repo_btns}>
        <a href={html_url} target="_blank" className={classes.repo_btn}>
          <span>Ver código</span>
          <RiGitRepositoryLine />
        </a>
        <a className={classes.repo_btn}>
        <Link to={`/Project/${name}`}><span>Ver Projetos</span></Link>
        <FaFolderOpen  />
        </a>
      </div>
    </div>
  );
};

export default Repo;
