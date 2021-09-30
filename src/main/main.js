import { app } from 'electron'
import { main } from '@/index.js'

if (!app.requestSingleInstanceLock()) {
    app.quit()
}

app.once('ready', () => {
    main()
})