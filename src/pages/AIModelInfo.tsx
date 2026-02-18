import { 
  Brain, 
  Cpu, 
  Database, 
  GitBranch, 
  Layers, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Code,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const modelFeatures = [
  {
    icon: Layers,
    title: "Deep Learning Architecture",
    description: "Transformer-based neural network with attention mechanisms for analyzing complex transaction patterns and wallet behaviors.",
  },
  {
    icon: Database,
    title: "Training Data",
    description: "Trained on 50M+ labeled transactions, including known phishing attempts, rug pulls, and legitimate DeFi interactions.",
  },
  {
    icon: Cpu,
    title: "Real-time Inference",
    description: "Sub-100ms prediction latency using optimized model serving with GPU acceleration for instant risk assessment.",
  },
  {
    icon: GitBranch,
    title: "Continuous Learning",
    description: "Model retraining pipeline that incorporates new threat patterns and community-reported incidents weekly.",
  },
];

const pipelineSteps = [
  {
    title: "Data Collection",
    description: "Gather wallet address, transaction history, and network data",
    color: "bg-primary/10 border-primary/30",
  },
  {
    title: "Feature Engineering",
    description: "Extract 200+ features including temporal patterns, graph metrics, and token flows",
    color: "bg-success/10 border-success/30",
  },
  {
    title: "Model Inference",
    description: "Pass features through ensemble of neural networks and gradient boosting models",
    color: "bg-warning/10 border-warning/30",
  },
  {
    title: "Risk Scoring",
    description: "Aggregate predictions into final risk score with confidence intervals",
    color: "bg-destructive/10 border-destructive/30",
  },
];

const metrics = [
  { label: "Accuracy", value: "99.7%", description: "On held-out test set" },
  { label: "Precision", value: "98.2%", description: "True positive rate" },
  { label: "Recall", value: "97.8%", description: "Detection sensitivity" },
  { label: "F1 Score", value: "98.0%", description: "Harmonic mean" },
];

const techStack = [
  "PyTorch",
  "Transformers",
  "XGBoost",
  "Graph Neural Networks",
  "ONNX Runtime",
  "Redis",
  "Kubernetes",
  "Apache Kafka",
];

export default function AIModelInfo() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          AI Model <span className="gradient-text">Information</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Technical details about the machine learning models powering ChainGuard
        </p>
      </div>

      {/* Hero Card */}
      <div className="glass-card p-8 gradient-border">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="relative">
            <div className="p-6 rounded-2xl bg-primary/10">
              <Brain className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-warning animate-pulse" />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-2">ChainGuard Neural Engine</h2>
            <p className="text-muted-foreground max-w-xl">
              State-of-the-art ensemble model combining transformer architectures with 
              gradient boosting for comprehensive blockchain security analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Model Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelFeatures.map((feature, index) => (
          <div
            key={feature.title}
            className="glass-card p-6 hover:border-primary/30 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-primary/10 h-fit">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ML Pipeline */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          ML Pipeline
        </h3>
        <div className="flex flex-col lg:flex-row gap-4">
          {pipelineSteps.map((step, index) => (
            <div key={step.title} className="flex-1 flex items-center gap-4">
              <div
                className={cn(
                  "flex-1 p-4 rounded-xl border-2",
                  step.color
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {index + 1}
                  </span>
                </div>
                <h4 className="font-medium mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < pipelineSteps.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 hidden lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Model Performance Metrics
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-4 rounded-xl bg-secondary/30 text-center"
            >
              <p className="text-3xl font-bold gradient-text">{metric.value}</p>
              <p className="font-medium mt-1">{metric.label}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg bg-secondary/50 text-sm font-medium border border-border/50 hover:border-primary/30 transition-all"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Interview Ready Section */}
      <div className="glass-card p-6 border-l-4 border-l-primary">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Interview Talking Points
        </h3>
        <ul className="space-y-3">
          {[
            "Ensemble approach combining deep learning (transformers) with traditional ML (XGBoost) for robust predictions",
            "Feature engineering captures both temporal transaction patterns and graph-based wallet relationships",
            "Real-time inference architecture using ONNX optimization and Redis caching for sub-100ms latency",
            "Continuous model monitoring and retraining pipeline to adapt to evolving threat landscape",
            "Explainable AI components provide risk factor breakdowns for end-user transparency",
          ].map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
