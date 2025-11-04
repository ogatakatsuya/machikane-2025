import streamlit as st
import pandas as pd
import json
import plotly.express as px

st.set_page_config(page_title="まちかね祭来客者分析", layout="wide")

@st.cache_data
def load_data():
    import os
    
    # CSVファイルのパスを確認
    base_dir = os.path.dirname(os.path.abspath(__file__))
    results_path = os.path.join(base_dir, "csv", "machikane.public.results.csv")
    groups_path = os.path.join(base_dir, "csv", "machikane.public.groups.csv")
    
    # ファイルの存在確認とエラーハンドリング
    if not os.path.exists(results_path):
        st.error(f"Results file not found: {results_path}")
        st.stop()
    
    if not os.path.exists(groups_path):
        st.error(f"Groups file not found: {groups_path}")
        st.stop()
    
    results_df = pd.read_csv(results_path)
    groups_df = pd.read_csv(groups_path)
    
    results_df['created_at'] = pd.to_datetime(results_df['created_at']).dt.tz_convert('Asia/Tokyo')
    results_df['hour'] = results_df['created_at'].dt.floor('H')
    
    merged_df = results_df.merge(groups_df, left_on='group_id', right_on='id', suffixes=('_result', '_group'))
    
    return results_df, groups_df, merged_df

def parse_context(context_str):
    try:
        return json.loads(context_str)
    except json.JSONDecodeError:
        return {}

def analyze_question_performance(context_data):
    question_stats = {}
    for context in context_data:
        if 'questionStates' in context:
            for q in context['questionStates']:
                q_id = q['id']
                status = q.get('status', 'unanswered')
                
                if q_id not in question_stats:
                    question_stats[q_id] = {'correct': 0, 'incorrect': 0, 'unanswered': 0, 'total': 0}
                
                question_stats[q_id][status] += 1
                question_stats[q_id]['total'] += 1
    
    return question_stats

def main():
    st.title("🎌 まちかね祭来客者データ分析")
    
    results_df, groups_df, merged_df = load_data()
    
    st.sidebar.header("📊 データ概要")
    st.sidebar.metric("総グループ数", len(groups_df))
    st.sidebar.metric("総回答数", len(results_df))
    st.sidebar.metric("総来客者数", merged_df['group_size'].sum())
    
    tab1, tab2, tab3 = st.tabs(["⏰ 時間別来客者数", "📝 問題分析", "📈 スコア分析"])
    
    with tab1:
        st.header("1時間ごとの来客者数")
        
        hourly_visitors = merged_df.groupby('hour').agg({
            'group_size': 'sum',
            'id_result': 'count'
        }).reset_index()
        hourly_visitors.columns = ['時間', '来客者数', 'グループ数']
        
        fig = px.bar(hourly_visitors, x='時間', y='来客者数', 
                     title="時間別来客者数 (レコード数 × group_size)",
                     labels={'時間': '時間', '来客者数': '来客者数（人）'})
        fig.update_layout(height=500)
        st.plotly_chart(fig, use_container_width=True)
        
        col1, col2 = st.columns(2)
        with col1:
            fig2 = px.line(hourly_visitors, x='時間', y='来客者数', 
                          title="来客者数の推移", markers=True)
            st.plotly_chart(fig2, use_container_width=True)
        
        with col2:
            fig3 = px.bar(hourly_visitors, x='時間', y='グループ数', 
                         title="時間別グループ数")
            st.plotly_chart(fig3, use_container_width=True)
        
        st.subheader("📋 時間別詳細データ")
        st.dataframe(hourly_visitors, use_container_width=True)
    
    with tab2:
        st.header("問題分析 (Context データ)")
        
        context_data = [parse_context(ctx) for ctx in results_df['context']]
        question_stats = analyze_question_performance(context_data)
        
        if question_stats:
            question_df = pd.DataFrame.from_dict(question_stats, orient='index')
            question_df.index.name = '問題ID'
            question_df['正答率'] = (question_df['correct'] / question_df['total'] * 100).round(1)
            
            fig = px.bar(question_df.reset_index(), x='問題ID', y='正答率',
                        title="問題別正答率", 
                        labels={'問題ID': '問題ID', '正答率': '正答率 (%)'})
            fig.update_layout(height=500)
            st.plotly_chart(fig, use_container_width=True)
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("📊 問題別統計")
                display_df = question_df[['correct', 'incorrect', 'unanswered', '正答率']].copy()
                display_df.columns = ['正解', '不正解', '未回答', '正答率(%)']
                st.dataframe(display_df, use_container_width=True)
            
            with col2:
                st.subheader("🎯 最も難しい問題 Top 5")
                hardest = question_df.nsmallest(5, '正答率')[['正答率', 'total']]
                hardest.columns = ['正答率(%)', '回答数']
                st.dataframe(hardest, use_container_width=True)
        
        st.subheader("📄 Context データサンプル")
        if len(context_data) > 0:
            sample_context = context_data[0]
            st.json(sample_context)
    
    with tab3:
        st.header("スコア分析")
        
        col1, col2 = st.columns(2)
        
        with col1:
            fig = px.histogram(results_df, x='score', nbins=20,
                             title="スコア分布")
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            score_by_size = merged_df.groupby('group_size')['score'].mean().reset_index()
            fig = px.bar(score_by_size, x='group_size', y='score',
                        title="グループサイズ別平均スコア")
            st.plotly_chart(fig, use_container_width=True)
        
        st.subheader("📊 スコア統計")
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("平均スコア", f"{results_df['score'].mean():.1f}")
        with col2:
            st.metric("最高スコア", results_df['score'].max())
        with col3:
            st.metric("最低スコア", results_df['score'].min())
        with col4:
            st.metric("標準偏差", f"{results_df['score'].std():.1f}")

if __name__ == "__main__":
    main()
