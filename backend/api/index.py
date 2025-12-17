import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с данными менеджера проектов
    Поддерживает операции: GET (получение данных), POST (создание/обновление)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            action = params.get('action', 'get_all')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if action == 'get_all':
                    cur.execute('SELECT * FROM projects WHERE is_removed = false ORDER BY created_at DESC')
                    projects = cur.fetchall()
                    
                    cur.execute('SELECT * FROM clients ORDER BY name')
                    clients = cur.fetchall()
                    
                    cur.execute('SELECT * FROM project_expenses ORDER BY created_at DESC')
                    expenses = cur.fetchall()
                    
                    cur.execute('SELECT * FROM comments ORDER BY timestamp DESC')
                    comments = cur.fetchall()
                    
                    cur.execute('SELECT * FROM project_files ORDER BY timestamp DESC')
                    files = cur.fetchall()
                    
                    cur.execute('SELECT * FROM projects WHERE is_removed = true ORDER BY updated_at DESC')
                    removed_projects = cur.fetchall()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'projects': projects,
                            'clients': clients,
                            'expenses': expenses,
                            'comments': comments,
                            'files': files,
                            'removedProjects': removed_projects
                        }, default=str),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            with conn.cursor() as cur:
                if action == 'save_project':
                    project = body_data['data']
                    cur.execute('''
                        INSERT INTO projects (id, name, client, start_date, end_date, total_cost, status, duration, is_removed)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            name = EXCLUDED.name,
                            client = EXCLUDED.client,
                            start_date = EXCLUDED.start_date,
                            end_date = EXCLUDED.end_date,
                            total_cost = EXCLUDED.total_cost,
                            status = EXCLUDED.status,
                            duration = EXCLUDED.duration,
                            is_removed = EXCLUDED.is_removed,
                            updated_at = CURRENT_TIMESTAMP
                    ''', (
                        project['id'], project['name'], project['client'],
                        project['startDate'], project['endDate'], project['totalCost'],
                        project['status'], project.get('duration'), project.get('isRemoved', False)
                    ))
                    conn.commit()
                    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
                
                elif action == 'save_client':
                    client = body_data['data']
                    cur.execute('''
                        INSERT INTO clients (id, name, projects_count, total_revenue)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            name = EXCLUDED.name,
                            projects_count = EXCLUDED.projects_count,
                            total_revenue = EXCLUDED.total_revenue,
                            updated_at = CURRENT_TIMESTAMP
                    ''', (client['id'], client['name'], client['projectsCount'], client['totalRevenue']))
                    conn.commit()
                    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
                
                elif action == 'save_expense':
                    expense = body_data['data']
                    cur.execute('''
                        INSERT INTO project_expenses (id, project_id, category, amount)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            category = EXCLUDED.category,
                            amount = EXCLUDED.amount,
                            updated_at = CURRENT_TIMESTAMP
                    ''', (expense['id'], expense['projectId'], expense['category'], expense['amount']))
                    conn.commit()
                    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
                
                elif action == 'save_comment':
                    comment = body_data['data']
                    cur.execute('''
                        INSERT INTO comments (id, project_id, text, timestamp)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (id) DO NOTHING
                    ''', (comment['id'], comment['projectId'], comment['text'], comment['timestamp']))
                    conn.commit()
                    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
                
                elif action == 'save_file':
                    file = body_data['data']
                    cur.execute('''
                        INSERT INTO project_files (id, project_id, name, size, timestamp, url)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO NOTHING
                    ''', (file['id'], file['projectId'], file['name'], file['size'], file['timestamp'], file['url']))
                    conn.commit()
                    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
                
                elif action == 'remove_file':
                    file_id = body_data['fileId']
                    cur.execute('UPDATE project_files SET url = %s WHERE id = %s', ('', file_id))
                    conn.commit()
                    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'success': True}), 'isBase64Encoded': False}
        
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Invalid request'}), 'isBase64Encoded': False}
    
    finally:
        conn.close()
