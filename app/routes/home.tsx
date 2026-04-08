import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowRight, Layers, Clock, ArrowUpRight} from "lucide-react";
import Button from "components/ui/Button";
import Upload from "components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useReducer, useRef, useState } from "react";
import { createProject, getProject } from "lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const isCreatingProjectRef = useRef(false);

    const handleUploadComplete = async (base64Image: string) => {
      try {
        if(isCreatingProjectRef.current) return false;
        isCreatingProjectRef.current = true;
        const newId = Date.now().toString();
        const name = `Residence ${newId}`;

        const newItem = {
          id: newId, name, sourceImage: base64Image, 
          renderedImage: undefined,
          timestamp: Date.now()
        }

        const saved = await createProject({ item: newItem, visibility: 'private' });

        if(!saved) {
          console.error("Failed to create project");
          return false;
        }

        setProjects((prev) => [saved, ...prev]);

        navigate(`/visualizer/${newId}`, {
          state: {
            initialImage: saved.sourceImage,
            initialRendered: saved.renderedImage || null,
            name
          }
        });

        return true;
      } finally {
        isCreatingProjectRef.current = false;
      }
    }

    useEffect(() => {
      const fetchProjects = async () => {
        const items = await getProject();

        setProjects(items)
      }

      fetchProjects();
    }, []);

  return (
   <div className="home">
    <Navbar />

    <section className="hero">
      <div className="announce">
        <div className="dot">
          <div className="pulse"></div>
        </div>

        <p>Introducing Realify 2.0</p>
      </div>

      <h1>Bring your ideas to life with Realify</h1>

      <p className="subtitle">
        Realify is an AI-powered render engine that transforms your designs into photorealistic visuals in seconds.
      </p>

      <div className="actions">
        <a href="#upload" className="cta">
          Transform <ArrowRight className="icon" />
        </a>
        
        <Button variant="outline" size="lg" className="demo">Watch Demo</Button>
      </div>

      <div id ="upload" className="upload-shell">
        <div className="grid-overlay" />

          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>

              <h3>Upload your ideas</h3>
              <p>Supports JPG, PNG, & WEBP formats up to 10MB</p>
            </div>

            <Upload onComplete={handleUploadComplete} />
          </div>
      </div>
    </section>

    <section className="projects">
      <div className="section-inner">
        <div className="section-head">
          <div className="copy">
            <h2>Projects</h2>
            <p>Your latest works, all in one place.</p>
          </div>
        </div>
        
        <div className="projects-grid">
          {projects.map(({id, name, renderedImage, sourceImage, timestamp}) => (
            <div key={id} className="project-card group" onClick={() => navigate(`/visualizer/${id}`)}>
              <div className="preview">
                <img 
                src={renderedImage || sourceImage} alt="Project"
                />

                <div className="badge">
                  <span>Private</span>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <h3>{name}</h3>

                  <div className="meta">
                    <Clock size={12} />
                    <span>
                      {new Date(timestamp).toLocaleDateString()}
                    </span> 
                    <span>By you</span>
                  </div>
                </div>
                <div className="arrow">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
            ))}
        </div>

      </div>
    </section>
   </div>
  )
}
