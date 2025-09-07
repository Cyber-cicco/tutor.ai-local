import { MathJaxContext, MathJax } from 'better-react-mathjax'
import ReactMarkdown,{ type Options }  from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import RemarkMath from 'remark-math'

type OptionsOmitingChildren = Omit<Options, 'children'>
interface Props {
  markdown: string
  reactMarkdownProps?: OptionsOmitingChildren
}

export const ReactMarkdownMath = ({ markdown, reactMarkdownProps }: Props) => {
  const reactMarkdownPropswithMathjax = {
    ...reactMarkdownProps,
    remarkplugins: [RemarkMath],
    components: {
      ...reactMarkdownProps?.components,
      math: (props: any) => <MathJax>{props.value}</MathJax>,
      inlineMath: (props: any) => <MathJax>{props.value}</MathJax>
    }
  }
  return (
    <MathJaxContext hideUntilTypeset='first'>
      <ReactMarkdown rehypePlugins={[rehypeKatex]} {...reactMarkdownPropswithMathjax}>
        {markdown}
      </ReactMarkdown>
    </MathJaxContext>
  )
}
