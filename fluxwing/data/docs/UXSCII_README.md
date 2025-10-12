# uxscii: The AI-Native Design Markup Language

> **The foundational markup language for AI-powered design tools**

```ascii
╭───────────────────────────────────────╮
│  ┌─────────────────┐                  │
│  │ uxscii Language │  ←── Markup      │ 
│  │ Specification   │      Language    │
│  └─────────────────┘                  │
│           ↓                           │
│  ╭─────────────────╮                  │
│  │ .uxm Format     │  ←── Machine     │
│  │ .md Templates   │      Readable    │
│  │ File Standards  │      Standards   │
│  ╰─────────────────╯                  │
│           ↓                           │
│  ╭─────────────────╮                  │
│  │ [Future AI      │  ←── Tools Built │
│  │  Tools Use      │      On This     │
│  │  This Spec]     │      Foundation  │
│  ╰─────────────────╯                  │
╰───────────────────────────────────────╯
```

**uxscii** defines the foundational markup language for AI-native design tools. Instead of retrofitting AI onto existing visual formats, we're creating the specification that enables AI agents to understand, manipulate, and generate design representations with unprecedented fluency.

## 🚀 Why uxscii Changes Everything

### The Problem with Current Design Formats
- **Proprietary formats lock out innovation**: Figma files, Sketch documents are closed binary formats
- **No AI-native standards**: Existing formats were designed for humans, not AI agents
- **Tool vendor lock-in**: Designs trapped in specific applications
- **Inconsistent representations**: Same design means different things in different tools

### The uxscii Solution
- **Open specification**: Publicly defined markup language that anyone can implement
- **AI-native by design**: Format optimized for machine parsing and generation from the ground up
- **Universal standard**: One representation that works across all tools and platforms  
- **Version control ready**: Text-based format with meaningful diffs and collaboration features

## ✨ What Makes This Specification Powerful

### 📝 Human-Readable, AI-Parseable Format
```ascii
# Example uxscii component definition:
┌─ Dashboard Layout ─────────────────────┐
│ ╭─ Sidebar ─╮ ╭─ Main Content ──────╮ │
│ │ • Home    │ │ ╭─ Data Table ─────╮ │ │
│ │ • Users   │ │ │ Name │ Status    │ │ │
│ │ • Reports │ │ │ Alice │ Active   │ │ │
│ │ • Settings│ │ │ Bob   │ Away     │ │ │
│ ╰───────────╯ │ ╰──────────────────╯ │ │
│               ╰─────────────────────────╯ │
└─────────────────────────────────────────┘

# Corresponding .uxm metadata:
{
  "type": "layout",
  "components": {
    "sidebar": { "width": "200px", "items": ["home", "users", "reports", "settings"] },
    "main": { "flex": 1, "content": "data-table" }
  }
}
```

### 🏗️ Architecture That Enables Innovation
```ascii
Language Specification → Multiple Tool Implementations
        ↓                         ↓
   Format Standards          AI Generation Tools
   Parsing Rules            Visual Editors
   Extension Points         Code Generators
```

### 📈 Version Control That Actually Works
```diff
- ┌─────────────┐
- │   Button    │ 
- └─────────────┘

+ ╭─────────────╮
+ │   Button    │ ← rounded corners
+ │   [icon]    │ ← added icon
+ ╰─────────────╯
```
*Every design change is as clear as a code diff*

## 🎯 Perfect For

### 🛠️ **Tool Builders** who want to:
- Build AI-powered design tools on a solid foundation
- Focus on innovation rather than format definition  
- Ensure compatibility with other tools in the ecosystem
- Implement design parsing and generation with clear standards

### 🏗️ **Language Designers** who want to:
- Contribute to an open standard for design representation
- Extend the specification for domain-specific needs
- Research new approaches to design-code integration
- Build the future of human-AI collaboration interfaces

### 🌐 **Design System Teams** who want to:
- Establish tool-independent design representations
- Create documentation that stays synchronized with designs  
- Enable cross-platform consistency without vendor lock-in
- Future-proof their design systems for AI integration

## 🚀 Getting Started

### Understanding the Language

uxscii defines two primary formats that work together:

```bash
# Clone the language specification
git clone https://github.com/uxscii/uxscii-spec

# Explore the format definitions
cd uxscii-spec/formats/

# Study the examples
cd ../examples/
```

### Format Examples

**`.uxm` files** - Machine-readable component definitions:
```json
{
  "type": "card",
  "metadata": {
    "width": "300px",
    "padding": "16px"
  },
  "content": {
    "title": "Card Title",
    "description": "Card description text", 
    "actions": ["primary-button"]
  }
}
```

**`.md` files** - ASCII visual templates:
```ascii
╭─────────────────────────╮
│ {{title}}               │
│ ─────────────────────── │
│ {{description}}         │
│                         │
│              [{{action}}] ─┤
╰─────────────────────────╯
```

*AI tools built on this specification can generate and validate components automatically.*

## 🌟 Language Features

### 📝 **Human-Readable Syntax**
- ASCII representations that anyone can read and understand
- Markdown-compatible for seamless documentation integration
- JSON metadata for complex behaviors and relationships

### 🤖 **AI-Optimized Structure**
- Designed specifically for machine parsing and generation
- Unambiguous syntax rules for consistent interpretation
- Extensible format that adapts to new AI capabilities

### 🔀 **Version Control Native**
- Text-based format with meaningful git diffs
- Collaborative editing without binary merge conflicts
- Complete change history and attribution tracking

### 🛠️ **Tool Independence**
- Open specification that any tool can implement
- No vendor lock-in or proprietary dependencies
- Cross-platform compatibility by design

### 🎯 **Extensible Architecture**
- Clear extension points for custom component types
- Plugin system for domain-specific design languages
- Community-driven evolution of the standard

### 🌐 **Universal Compatibility**
- Works in any text editor on any platform
- Accessible to screen readers and assistive technologies  
- No special software required to view or edit

## 🔥 Specification Roadmap

### Phase 1: Core Language (Current)
- [x] Define .uxm format specification
- [x] Establish ASCII template standards
- [ ] Complete JSON schema validation rules
- [ ] File organization standards

### Phase 2: Extended Specification
- [ ] Advanced component interaction definitions
- [ ] Responsive design representation standards
- [ ] Animation and transition specifications
- [ ] Accessibility requirement integration

### Phase 3: Ecosystem Standards
- [ ] Extension specification for custom components
- [ ] Integration standards for various output formats
- [ ] Versioning and migration standards
- [ ] Community governance model

## 🤝 Contributing

We're defining the future of design language standards, and we'd love your help:

- **💭 Propose language features** in [Issues](https://github.com/uxscii/uxscii-spec/issues)
- **📝 Contribute to specifications** and documentation  
- **🧪 Create example implementations** to test the language
- **📖 Improve language documentation** and tutorials
- **💬 Join discussions** in our [Discord community](https://discord.gg/uxscii)

### Specification Development
```bash
git clone https://github.com/uxscii/uxscii-spec
cd uxscii-spec
# Review current specifications
ls formats/
# Add examples or improvements
```

## 📚 Learn More

- **[📖 Language Specification](./docs/)** - Complete format definitions and rules
- **[🎨 Examples](./examples/)** - Reference implementations and use cases
- **[📋 Schema Reference](./formats/)** - JSON schemas and validation rules
- **[💬 Community](https://discord.gg/uxscii)** - Connect with language contributors
- **[📰 Blog](https://uxscii.dev/blog)** - Language evolution and research

## 🙋 FAQ

**Q: Is this a design tool?**
A: No, UXSCII is a language specification. We're defining the markup format that AI design tools can implement. For an example implementation, see Fluxwing, an AI tool that uses UXSCII.

**Q: How do I use UXSCII files?**
A: Tools that implement the UXSCII specification can read and generate these files. For example, Fluxwing is an AI-powered tool built on UXSCII.

**Q: Why create a new format instead of using existing ones?**  
A: Existing formats (Figma, Sketch, etc.) weren't designed for AI collaboration. uxscii is built from the ground up for machine parsing and generation.

**Q: Who decides how the language evolves?**  
A: The community! We're establishing a governance model for collaborative language development, similar to other open standards.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Ready to build the future of design representation?**

[📖 Read the Spec](./docs/) • [💬 Join Discord](https://discord.gg/uxscii) • [🐦 Follow Updates](https://twitter.com/uxscii)

*Defining the foundation for AI-native design collaboration*

</div>
