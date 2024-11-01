import { useEffect, useState } from "react";
import { ProjectProps } from "../types/project";
import { useParams } from "react-router-dom"; 
import { BsCodeSlash } from "react-icons/bs";  
import { RiGitRepositoryLine } from "react-icons/ri";
import classes from "./PageProject.module.css";
import { FaJsSquare, FaNodeJs, FaReact, FaLink  } from "react-icons/fa"; 
import { SiCss3, SiHtml5, SiTypescript, SiNextdotjs } from "react-icons/si"; 
import Loader from "./Loader";
import { RepoProps } from "../types/repo";
import BackBtn from "./BackBtn";
import axios from '../axios-config';

interface IconMapping {
  [key: string]: JSX.Element;
}

const iconMapping: IconMapping = {
  "JAVASCRIPT": <FaJsSquare />,
  "NODE.JS": <FaNodeJs />,
  "TYPESCRIPT": <SiTypescript />,
  "HTML": <SiHtml5 />,
  "CSS": <SiCss3 />,
  "REACT": <FaReact />,
  "NEXT.JS": <SiNextdotjs />
};

interface ProjectResponse {
  projects: ProjectProps[];  
}

const PageProject = () => {
  const [data, setData] = useState<ProjectProps[] | null>(null);  
  const { repository } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterLanguage, setFilterLanguage] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [linkRepository, setLinkRepository] = useState<string>("");

  useEffect(() => {
    const loadData = async (repository: string) => {
      setIsLoading(true);
      const res = await axios.get(`/repositories?repository=${repository}`);
      const responseData: ProjectResponse = res.data; 

      setIsLoading(false);
      setData(responseData.projects);  
    };

    if (repository) {
      loadData(repository);
    }
  }, [repository]);

  useEffect(() => {
    const loadrepos = async function () {
      setIsLoading(true);

      const res = await fetch(`https://api.github.com/users/bergkley/repos`);

      const data = await res.json();
      
      const repo: { html_url: string } | null = data.find((repo: RepoProps) => repo.name === repository);
        
      if (repo) {
        setLinkRepository(repo.html_url);
      } 
    };
    loadrepos();
  }, []);

  if (!data) {
    return <Loader />;
  }

  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const filteredData = filterLanguage
    ? sortedData.filter(repo => repo.language.some(lang => lang.toUpperCase().includes(filterLanguage)))
    : sortedData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem); 

  const totalPages = Math.ceil(filteredData.length / itemsPerPage); 

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleLanguageFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterLanguage(event.target.value);
    setCurrentPage(1);
  };

  if (!data && isLoading) return <Loader />;

  return (
    <div>
      <BackBtn />
      <div className={classes.filters}>
        <button onClick={toggleSortOrder} className={classes.sortButton}>
          Ordem: {sortOrder === "asc" ? "Crescente" : "Decrescente"}
        </button>
        
        <select onChange={handleLanguageFilter} value={filterLanguage} className={classes.languageFilter}>
          <option value="">Todas as Linguagens</option>
          <option value="JAVASCRIPT">JavaScript</option>
          <option value="NODE.JS">Node.js</option>
          <option value="TYPESCRIPT">TypeScript</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="REACT">React</option>
        </select>
      </div>

      <div className={classes.repo}>
        {filteredData.length === 0 ? (
          <h1>Nenhum repositório encontrado com a linguagem selecionada.</h1>
        ) : (
          currentItems.map((repo, index) => (
            <div key={repo._id}>  
              <h3>{repo.name.replace(/-/g, " ")}</h3>
              <p>
                <BsCodeSlash /> {repo.language.join(" / ")}  
              </p>
  
              <div className={classes.icons}>
                {repo.language.map((lang, index) => (
                  <span key={index}>
                    {iconMapping[lang.toUpperCase()] || <BsCodeSlash />} 
                  </span>
                ))}
              </div>
  
              <div className={classes.repo_btns}>
                <a href={linkRepository} target="_blank" className={classes.repo_btn} rel="noopener noreferrer">
                  <span>Ver código</span>
                  <RiGitRepositoryLine />
                </a>
                <a href={`${repo?.link}`} target="_blank" className={classes.repo_btn}>
                  <span>Ver  o Projeto</span>
                  <FaLink />
                </a>
              </div>
  
              {index !== currentItems.length - 1 && <hr className={classes['common-hr']} />}
            </div>
          ))
        )}
      </div>
  
      <div className={classes.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={classes.pageButton}
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageProject;
