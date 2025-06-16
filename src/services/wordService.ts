class WordService {
  async getSelectedText(): Promise<string> {
    return new Promise((resolve, reject) => {
      Word.run(async (context) => {
        try {
          const range = context.document.getSelection();
          range.load('text');
          await context.sync();
          resolve(range.text);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async insertText(text: string, location: 'replace' | 'after' | 'before' = 'replace') {
    return Word.run(async (context) => {
      const range = context.document.getSelection();
      
      if (location === 'replace') {
        range.insertText(text, Word.InsertLocation.replace);
      } else if (location === 'after') {
        range.insertText(text, Word.InsertLocation.after);
      } else {
        range.insertText(text, Word.InsertLocation.before);
      }
      
      await context.sync();
    });
  }

  async getDocumentText(): Promise<string> {
    return new Promise((resolve, reject) => {
      Word.run(async (context) => {
        try {
          const body = context.document.body;
          body.load('text');
          await context.sync();
          resolve(body.text);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async getWordCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      Word.run(async (context) => {
        try {
          const body = context.document.body;
          const wordCountResult = body.getRange();
          wordCountResult.load('text');
          await context.sync();
          const words = wordCountResult.text.trim().split(/\s+/).filter(word => word.length > 0);
          resolve(words.length);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async highlightText(searchText: string, color: string = 'Yellow') {
    return Word.run(async (context) => {
      const searchResults = context.document.body.search(searchText, { matchCase: false, matchWholeWord: false });
      searchResults.load('length');
      await context.sync();

      for (let i = 0; i < searchResults.items.length; i++) {
        searchResults.items[i].font.highlightColor = color;
      }
      
      await context.sync();
    });
  }

  async clearHighlights() {
    return Word.run(async (context) => {
      context.document.body.font.highlightColor = '#FFFFFF';
      await context.sync();
    });
  }
}

export const wordService = new WordService();