import * as cprocess from 'child_process';
import * as util from 'util';

const exec = util.promisify(cprocess.exec);

async function windows(desktop: any): Promise<any[] | undefined> {
    if (desktop.focused !== true) return undefined;

    const windowsRes = await exec('chunkc tiling::query --desktop windows');
    const windows = Promise.all(windowsRes.stdout.split('\n')
        .filter(info => info.length > 0)
        .map(async (info) => {

            const [id, owner, name]: any = info.split(',');

            const window = {
                id,
                name: (name as string).trim(),
                owner: (owner as string).trim(),
                focused: false,
                floating: false,
                desktop
            };

            const focusedWindowNameRes = await exec(`chunkc tiling::query --window name`);
            const focusedWindowName = focusedWindowNameRes.stdout;

            window.focused = focusedWindowName === window.name;

            if (window.focused === true) {
                const floatingRes = await exec(`chunkc tiling::query --window float`);
                const floating = parseInt(floatingRes.stdout);
                window.floating = floating === 1;
            }

            return window;
        }));

    return windows;
}

async function desktopMode(desktop: any): Promise<string | undefined> {
    if (desktop.focused !== true) return undefined;

    const modeRes = await exec(`chunkc tiling::query --desktop mode`);
    const mode = modeRes.stdout;
    return mode;
}

async function desktops(monitor: any): Promise<any> {
    const focusedDesktopIdRes = await exec('chunkc tiling::query --desktop id');
    const focusedDesktopId = parseInt(focusedDesktopIdRes.stdout);

    const desktopsRes = await exec(`chunkc tiling::query --desktops-for-monitor ${monitor.id}`)
    const desktops = await Promise.all(desktopsRes.stdout.split(' ')
        .map(id => parseInt(id))
        .map(async (id) => {
            const focused = focusedDesktopId == id;
            return { id, focused, monitor };
        }));

    return desktops;
}

async function monitors(): Promise<any> {
    const focusedMonitorIdRes = await exec('chunkc tiling::query --monitor id');
    const focusedMonitorId = parseInt(focusedMonitorIdRes.stdout);

    const countRes = await exec('chunkc tiling::query --monitor count');
    const count = parseInt(countRes.stdout)

    const monitors = [...Array(count).keys()]
        .map(index => {
            const id = index + 1;
            const focused = focusedMonitorId == id;
            return { id, focused }
        });

    return monitors;
}

export default {
    Query: {
        monitors
    },
    Monitor: {
        desktops
    },
    Desktop: {
        windows,
        mode: desktopMode
    },
};
