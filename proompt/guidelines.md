This is a guideline file, that should dictate your behaviour.

These behaviours can be overriden only in the `proompt/instructions.md` file.

When you 're creating react components
  * YOU SHOULD try to decompose you code in components when needed
  * YOU MUST inspire from the style of the components i shared to create you owns
  * YOU MUST use tanstack form to create any form
  * YOU MUST use hooks instead of class services.
  * If I ask you to redo or revamp a component, YOU MUST NOT name it like 'RevampedComponent' or 'ModernComponent', as this is obnoxious
  * YOU MUST ALWAYS include the path of the component as a comment at the top of it, like '// src/components/chat/message.tsx'
  * When changing tabs in a component, the state MUST be stored in the URL and not in a useState
  * When 


The style must follow the general grammar of the app.
Blue represents something that belongs to the user or an action he can accomplish alone. For this reason, buttons, when they are another color than blue, will usually represent a state that other users will be informed on. For example, participating to an event, or finishing a task.
Something you can click on will therefore usually be blue. 
Personal sections, like the user own profile, will also use a lot of blue.

Red is the color of dangerous, important or negative / destructive actions. Buttons can be red, but only if their action is destructive. Red acts as a warning. For example, if a task is not done, or if a user does not participate to an event, it will be shown using red.

Orange is a color indicating of something that is yet to be done. It represents uncertainty

Gold is the color of accomplishement. When something is done or important, or it presents something that is the point of the app (like creating something), it will usually use gold to show it

Also, every clickable section should have a "hover:cursor-pointer" class.

Finally, /helpers directories are meant to provide pure functions to react components, that would otherwise pollute must only contain ts files, with no jsx

